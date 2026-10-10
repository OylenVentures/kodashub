import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cart } from '../cart/entities/cart.entity';
import { Payment } from './entities/payment.entity';
import { PaymentEvent } from './entities/payment-event.entity';
import { FulfillmentHandlerRegistry } from './registry/fulfillment-handler.registry';
import { createHash } from 'crypto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(PaymentEvent)
    private readonly paymentEventRepo: Repository<PaymentEvent>,
    private fulfillmentRegistry: FulfillmentHandlerRegistry,
    private dataSource: DataSource,
  ) {}

  /**
   * Initialize a payment transaction with idempotency safeguards.
   * - Generates idempotency key from cartId + userId + timestamp
   * - Checks if a pending payment already exists (retry case)
   * - Creates payment record in "pending" state
   * - Reserves the cart (marks it as linked to payment, not deleted)
   * - Requests authorization URL from Paystack
   */
  async initializePayment(dto: CreatePaymentDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cartItems = await queryRunner.manager.find(Cart, {
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!cartItems || cartItems.length === 0) {
        throw new NotFoundException('Cart not found');
      }

      // Validate cart prices before creating the single checkout payment
      if (!cartItems.every((c) => typeof c.price === 'number' && c.price > 0)) {
        throw new BadRequestException('All cart items must have a valid price');
      }

      const totalPrice = this.calculateTotalPrice(cartItems);
      if (totalPrice <= 0) {
        throw new BadRequestException('Cart price must be greater than zero');
      }

      const cartItemsSnapshot = cartItems.map((cartItem) => ({
        id: cartItem.id,
        serviceType: cartItem.serviceType,
        price: cartItem.price,
        metadata: cartItem.metadata,
      }));

      const idempotencySeed = `${userId}:${cartItemsSnapshot
        .map((item) => item.id)
        .sort()
        .join(',')}:${totalPrice}`;
      const idempotencyKey = createHash('sha256')
        .update(idempotencySeed)
        .digest('hex');

      const existingPayment = await queryRunner.manager.findOne(Payment, {
        where: { idempotencyKey },
      });

      if (existingPayment) {
        this.logger.log(
          `Payment already initialized for cart checkout with key ${idempotencyKey}`,
        );
        await queryRunner.rollbackTransaction();
        return {
          message: 'Payment already initialized',
          result: {
            reference: existingPayment.transactionRef,
            authorization_url: existingPayment.authorizationUrl,
            paymentId: existingPayment.id,
          },
          isRetry: true,
        };
      }

      const paystackResponse = await this.initializePaystackTransaction(
        cartItems[0].user.email,
        totalPrice,
        idempotencyKey,
        userId,
        dto.method,
        cartItemsSnapshot,
      );

      const newPayment = queryRunner.manager.create(Payment, {
        idempotencyKey,
        amount: totalPrice,
        currency: 'NGN',
        serviceType: 'cart_checkout',
        status: 'pending',
        transactionRef: paystackResponse.data.reference,
        authorizationUrl: paystackResponse.data.authorization_url,
        paystackResponse: JSON.stringify(paystackResponse.data),
        metadata: {
          cartCount: cartItems.length,
          totalPrice,
          cartIds: cartItemsSnapshot.map((item) => item.id),
          cartItems: cartItemsSnapshot,
          method: dto.method,
        },
        cartItemsSnapshot,
        cartCount: cartItems.length,
        user: cartItems[0].user,
      });

      await queryRunner.manager.save(newPayment);

      for (const cartItem of cartItems) {
        cartItem.updatedAt = new Date();
        await queryRunner.manager.save(cartItem);
      }

      await queryRunner.commitTransaction();

      this.logger.log(`Payments initialized for user ${userId}`);

      return {
        message: 'Payment initialized successfully',
        result: paystackResponse.data,
        paymentId: newPayment.id,
      };
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `Payment initialization failed: ${err.message}`,
        err.stack,
      );
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Calculate total price for the cart array items with VAT of 7.5%.
   */
  private calculateTotalPrice(cartItems: Cart[]) {
    let total = 0;
    for (const item of cartItems) {
      total += item.price;
    }
    return Math.round(total * 1.075); // Add 7.5% VAT
  }

  /**
   * Private helper: Initialize transaction with Paystack API.
   */
  private async initializePaystackTransaction(
    email: string,
    amount: number,
    idempotencyKey: string,
    userId: string,
    method: string,
    cartItems: Array<{
      id: string;
      serviceType: string;
      price: number;
      metadata: Record<string, any>;
    }>,
  ) {
    const response = await fetch(
      'https://api.paystack.co/transaction/initialize',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({
          email,
          amount: amount * 100, // Convert to cents
          reference: `checkout-${userId}-${Date.now()}`,
          currency: 'NGN',
          channels: [method.toLowerCase()],
          callback_url: process.env.PAYSTACK_CALLBACK_URL ?? '',
          metadata: {
            cartCount: cartItems.length,
            cartIds: cartItems.map((item) => item.id),
            cartItems,
            userId,
            idempotencyKey,
          },
        }),
      },
    );

    const result = await response.json();
    if (!response.ok) {
      this.logger.error(
        `Paystack initialization failed: ${JSON.stringify(result)}`,
      );
      throw new InternalServerErrorException(
        'Failed to initialize payment with provider',
      );
    }

    return result;
  }

  async getAllPayments(userId: string) {
    const payments = await this.paymentRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'cart'],
      order: { createdAt: 'DESC' },
    });
    if (!payments || payments.length === 0) {
      throw new NotFoundException('No payments found for this user');
    }

    return { message: 'User payments rerieved successfully', result: payments };
  }

  /**
   * List all transactions (admin).
   */
  async listTransactions(perPage: number, page: number) {
    const response = await fetch(
      `https://api.paystack.co/transaction?page=${page}&perPage=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const result = await response.json();
    if (!response.ok) {
      throw new InternalServerErrorException('Failed to list transactions');
    }

    return result;
  }

  /**
   * Verify payment status with Paystack and update payment record.
   * Called both by webhook and by manual verification endpoint.
   */
  async verifyPayment(transactionRef: string) {
    const payment = await this.paymentRepo.findOne({
      where: { transactionRef },
      relations: ['cart', 'user'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Verify with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${transactionRef}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const result = await response.json();
    if (!response.ok) {
      throw new InternalServerErrorException(
        'Failed to verify payment with provider',
      );
    }

    // Update payment status based on Paystack response
    if (result.data.status === 'success') {
      payment.status = 'paid';
      payment.paidAt = new Date();
      await this.paymentRepo.save(payment);

      this.logger.log(`Payment verified and marked as paid: ${payment.id}`);

      // Trigger fulfillment using appropriate service handler
      return await this.fulfillService(payment);
    } else {
      payment.status = 'failed';
      payment.failedAt = new Date();
      payment.failureReason =
        result.data.gateway_response || 'Payment verification failed';
      await this.paymentRepo.save(payment);

      this.logger.warn(
        `Payment failed: ${payment.id} - ${payment.failureReason}`,
      );

      return {
        message: 'Payment verification failed',
        status: 'failed',
        reason: payment.failureReason,
      };
    }
  }

  /**
   * Process incoming webhook events from Paystack.
   * Implements idempotency by:
   * 1. Recording the event in PaymentEvent table with Paystack's event ID
   * 2. Checking if event was already processed
   * 3. Only processing once, returning 200 for retries
   */
  async processWebhookEvent(payload: unknown) {
    const p = (payload ?? {}) as Record<string, any>;
    const paystackEventId = p.id as string | undefined;
    const transactionRef = (p.data && p.data.reference) as string | undefined;
    const eventType = p.event as string | undefined;

    this.logger.log(
      `Webhook received: event=${eventType}, txn=${transactionRef}, paystackEventId=${paystackEventId}`,
    );

    // Check if this event was already processed (idempotency guard)
    const existingEvent = await this.paymentEventRepo.findOne({
      where: { paystackEventId },
    });

    if (existingEvent) {
      if (existingEvent.processingStatus === 'success') {
        this.logger.log(
          `Event already processed successfully: ${paystackEventId}`,
        );
        return { message: 'Event already processed', isRetry: true };
      } else if (existingEvent.processingStatus === 'processing') {
        this.logger.warn(`Event still processing: ${paystackEventId}`);
        return { message: 'Event is still being processed' };
      }
      // If failed, attempt to reprocess
    }

    // Create event record to mark as processing
    let paymentEvent =
      existingEvent ||
      this.paymentEventRepo.create({
        paystackEventId,
        transactionRef,
        eventType,
        payload: p,
        processingStatus: 'processing',
      });

    await this.paymentEventRepo.save(paymentEvent);

    // Validate required fields
    if (!transactionRef) {
      paymentEvent.processingStatus = 'failed';
      paymentEvent.processingError = 'Missing transaction reference in payload';
      paymentEvent.processedAt = new Date();
      await this.paymentEventRepo.save(paymentEvent);

      this.logger.warn(
        `Webhook missing transaction reference: event=${paystackEventId}`,
      );
      return { message: 'Missing transaction reference', ok: false };
    }

    try {
      // Process the event
      await this.handlePaymentEvent(eventType!, payload, transactionRef!);

      // Mark event as successfully processed
      paymentEvent.processingStatus = 'success';
      paymentEvent.processedAt = new Date();
      await this.paymentEventRepo.save(paymentEvent);

      this.logger.log(`Event processed successfully: ${paystackEventId}`);

      return { message: 'Webhook processed' };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      // Mark event as failed but don't throw (webhook endpoint still returns 200)
      paymentEvent.processingStatus = 'failed';
      paymentEvent.processingError = err.message;
      paymentEvent.processedAt = new Date();
      await this.paymentEventRepo.save(paymentEvent);

      this.logger.error(
        `Event processing failed: ${paystackEventId} - ${err.message}`,
        err.stack,
      );

      // Return 200 to acknowledge receipt, but the event is marked as needing retry
      return {
        message: 'Webhook received (processing error, will retry)',
        error: err.message,
      };
    }
  }

  /**
   * Handle specific Paystack event types.
   */
  private async handlePaymentEvent(
    eventType: string,
    payload: unknown,
    transactionRef: string,
  ) {
    const payment = await this.paymentRepo.findOne({
      where: { transactionRef },
      relations: ['cart', 'user'],
    });

    if (!payment) {
      throw new NotFoundException(
        `Payment not found for transaction ${transactionRef}`,
      );
    }

    switch (eventType) {
      case 'charge.success':
      case 'transfer.success':
      case 'paymentrequest.success':
        // Verify once more before marking as paid (defense in depth)
        await this.verifyPayment(transactionRef);
        break;

      case 'transfer.failed':
      case 'transfer.reversed':
      case 'charge.failed':
        payment.status = 'failed';
        payment.failedAt = new Date();
        payment.failureReason = `Event: ${eventType}`;
        await this.paymentRepo.save(payment);
        this.logger.warn(
          `Payment marked as failed due to ${eventType}: ${payment.id}`,
        );
        break;

      default:
        this.logger.warn(`Unhandled Paystack event type: ${eventType}`);
        throw new BadRequestException(`Unhandled event type: ${eventType}`);
    }
  }

  /**
   * Fulfill a payment by registering the domain.
   * Called after payment is confirmed.
   * If domain registration fails, payment stays in "paid" state and can be retried.
   */
  /**
   * Fulfill a payment using appropriate service handler
   * - Dispatches to service-specific fulfillment handler
   * - Updates payment status on success/failure
   * - Handles errors gracefully (keeps payment in "paid" state if fulfillment fails)
   */
  private async fulfillService(payment: Payment) {
    const cartItemsSnapshot =
      payment.cartItemsSnapshot ||
      (payment.metadata?.cartItems as Payment['cartItemsSnapshot']) ||
      [];

    // Backward compatibility for older single-cart payments.
    if (!cartItemsSnapshot.length && payment.cart) {
      payment.cart =
        (await this.cartRepo.findOne({
          where: { id: payment.cart.id },
        })) || undefined;
    }

    if (!cartItemsSnapshot.length && !payment.cart) {
      throw new NotFoundException('Cart not found for payment fulfillment');
    }

    // Prevent double-fulfillment: re-load fresh payment state and short-circuit
    const fresh = await this.paymentRepo.findOne({ where: { id: payment.id } });
    if (!fresh) {
      throw new NotFoundException('Payment record not found');
    }

    if (fresh.status === 'fulfilled' || fresh.fulfilledAt) {
      this.logger.log(`Payment ${payment.id} already fulfilled, skipping`);
      return { message: 'Payment already fulfilled', isRetry: true };
    }

    if (fresh.status !== 'paid' && fresh.status !== 'fulfilling') {
      throw new BadRequestException(
        `Cannot fulfill payment with status ${fresh.status}`,
      );
    }

    // Mark as 'fulfilling' to signal in-progress fulfillment and reduce races
    fresh.status = 'fulfilling';
    await this.paymentRepo.save(fresh);

    try {
      this.logger.log(`Fulfilling payment ${payment.id}`);

      const fulfillmentResults: Array<{
        serviceType: string;
        result: unknown;
      }> = [];

      if (cartItemsSnapshot.length > 0) {
        for (const cartItem of cartItemsSnapshot) {
          const handler = this.fulfillmentRegistry.getHandler(
            cartItem.serviceType,
          );
          const fulfillmentResult = await handler.fulfill(
            cartItem.metadata,
            payment.user.id,
          );
          fulfillmentResults.push({
            serviceType: cartItem.serviceType,
            result: fulfillmentResult,
          });
        }
      } else {
        const handler = this.fulfillmentRegistry.getHandler(
          payment.serviceType,
        );
        const fulfillmentData =
          fresh.metadata || payment.metadata || payment.cart?.metadata;
        const fulfillmentResult = await handler.fulfill(
          fulfillmentData,
          payment.user.id,
        );
        fulfillmentResults.push({
          serviceType: payment.serviceType,
          result: fulfillmentResult,
        });
      }

      // Mark payment as fulfilled
      fresh.status = 'fulfilled';
      fresh.fulfilledAt = new Date();
      await this.paymentRepo.save(fresh);

      // Delete carts only after successful fulfillment
      try {
        if (cartItemsSnapshot.length > 0) {
          const cartIds = cartItemsSnapshot.map((item) => item.id);
          const cartsToRemove = await this.cartRepo.find({
            where: cartIds.map((id) => ({ id })),
          });
          if (cartsToRemove.length > 0) {
            await this.cartRepo.remove(cartsToRemove);
          }
        } else if (payment.cart) {
          await this.cartRepo.remove(payment.cart);
        }
      } catch (removeErr) {
        this.logger.warn(
          `Failed to remove cart for payment ${payment.id}: ${String(removeErr)}`,
        );
      }

      this.logger.log(`Payment fulfilled and completed: ${payment.id}`);

      return {
        message: 'Payment fulfilled successfully',
        service: payment.serviceType,
        result: fulfillmentResults,
      };
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));

      // Attempt to handle failure via service handler
      try {
        if (cartItemsSnapshot.length > 0) {
          for (const cartItem of cartItemsSnapshot) {
            const handler = this.fulfillmentRegistry.getHandler(
              cartItem.serviceType,
            );
            if (handler.handleFailure) {
              await handler.handleFailure(
                cartItem.metadata,
                payment.user.id,
                err.message,
              );
            }
          }
        } else {
          const handler = this.fulfillmentRegistry.getHandler(
            payment.serviceType,
          );
          if (handler.handleFailure) {
            await handler.handleFailure(
              fresh.metadata || payment.metadata || payment.cart?.metadata,
              payment.user.id,
              err.message,
            );
          }
        }
      } catch (handlerError: unknown) {
        const he =
          handlerError instanceof Error
            ? handlerError
            : new Error(String(handlerError));
        this.logger.error(
          `Error in failure handler for ${payment.serviceType}: ${he.message}`,
        );
      }

      // revert to 'paid' so manual retry is possible
      try {
        fresh.status = 'paid';
        await this.paymentRepo.save(fresh);
      } catch (saveErr) {
        this.logger.warn(
          `Failed to revert payment ${payment.id} to paid: ${String(saveErr)}`,
        );
      }

      this.logger.error(
        `${payment.serviceType} fulfillment failed for payment ${payment.id}: ${err.message}`,
        err.stack,
      );

      return {
        message: `Payment confirmed but ${payment.serviceType} fulfillment failed`,
        service: payment.serviceType,
        paymentStatus: 'paid',
        fulfillmentError: err.message,
        note: 'This payment is in "paid" state and requires manual retry or support intervention',
      };
    }
  }

  /**
   * Confirm payment status (manual verification endpoint for admins).
   */
  async confirmPayment(transactionRef: string) {
    return await this.verifyPayment(transactionRef);
  }
}
