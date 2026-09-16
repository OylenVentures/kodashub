import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UnauthorizedException,
  Req,
  Res,
  HttpStatus,
  RawBodyRequest,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/payment.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { createHmac } from 'crypto';

@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Generic payment initialization endpoint for any service type
   * The service type is determined from the cart's serviceType field
   *
   * USAGE for different services:
   * - Domain: Create cart with serviceType='domain', then call this endpoint
   * - Hosting: Create cart with serviceType='hosting', then call this endpoint
   * - SSL: Create cart with serviceType='ssl', then call this endpoint
   * - Email: Create cart with serviceType='email', then call this endpoint
   *
   * The fulfillment handler is automatically selected based on cart.serviceType
   */
  @ApiOperation({
    summary: 'Initialize a payment for any service type',
    description:
      'Initialize a payment transaction for a cart. Works with domain, hosting, ssl, email, or any registered service type. ' +
      'The service type is determined from cart.serviceType.',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Payment initialized. Returns Paystack checkout link.',
  })
  @UseGuards(JwtGuard)
  @Post('initialize')
  async initializePaymentGeneric(
    @Req() req: any,
    @Body() dto: CreatePaymentDto,
  ) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('Unauthorized user');
    }
    return this.paymentService.initializePayment(dto, req.user.id);
  }

  @ApiOperation({
    summary: 'Retrieve all saved transactions',
    description: 'Retrieve all saved transactions (admin only)',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @UseGuards(JwtGuard)
  @Get('all/:userId')
  getAllPayments(@Req() req: any, @Param('userId') userId: string) {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      throw new ForbiddenException('You are not authorized to restore user');
    }
    return this.paymentService.getAllPayments(userId);
  }

  @ApiOperation({
    summary: 'List all transactions',
    description: 'List all transactions (admin only)',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @UseGuards(JwtGuard)
  @Get('list/:page/:perPage')
  listTransactions(
    @Req() req: any,
    @Param('page') page: number,
    @Param('perPage') perPage: number,
  ) {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      throw new ForbiddenException('You are not authorized to restore user');
    }
    return this.paymentService.listTransactions(perPage, page);
  }

  @ApiOperation({
    summary: 'Verify a payment',
    description:
      'Verify the status of a payment by its transaction reference (admin only). ' +
      'For completed payments, this also triggers fulfillment of the associated service.',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @UseGuards(JwtGuard)
  @Get('verify/:transactionRef')
  async verifyPayment(
    @Req() req: any,
    @Param('transactionRef') transactionRef: string,
  ) {
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      throw new ForbiddenException('You are not authorized to verify payments');
    }
    if (!transactionRef) {
      throw new BadRequestException('Transaction reference is required');
    }
    return this.paymentService.confirmPayment(transactionRef);
  }

  /**
   * Webhook handler for Paystack payment events
   *
   * Security:
   * - Validates HMAC-SHA512 signature from Paystack
   * - Rejects requests with invalid or missing signatures (403)
   * - Uses raw request body for signature verification
   *
   * Processing:
   * - Deduplicates events using PaymentEvent.paystackEventId
   * - Marks completed payments for fulfillment
   * - Calls fulfillService() to provision the service
   *
   * Handled events:
   * - charge.success: Marks payment as paid, triggers fulfillment
   * - charge.failed: Marks payment as failed, logs issue
   * - Other events: Logged but not processed
   */
  @ApiOperation({
    summary: 'Handle Paystack webhook events',
    description:
      'Process incoming webhook events from Paystack. Validates signature, deduplicates events, ' +
      'marks payments, and triggers service fulfillment.',
  })
  @ApiOkResponse({ description: 'OK' })
  @Post('webhook')
  async webhookHandler(@Req() req: RawBodyRequest<Request>, @Res() res: any) {
    const secret = process.env.PAYSTACK_SECRET_KEY ?? '';
    if (!secret) {
      console.error('PAYSTACK_SECRET_KEY is not configured');
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: 'Configuration error' });
    }

    // Use the raw body buffer for HMAC to match Paystack's exact byte sequence
    const rawBody = req.rawBody ?? Buffer.from(JSON.stringify(req.body));
    const signature = (req.headers as any)['x-paystack-signature'];
    if (!signature) {
      console.warn('Webhook request missing paystack header');
      return res
        .status(HttpStatus.FORBIDDEN)
        .send({ message: 'Unauthorized: missing signature' });
    }

    // Verify signature
    const hash = createHmac('sha512', secret).update(rawBody).digest('hex');
    if (hash !== signature) {
      console.warn(
        `Webhook signature mismatch. Expected: ${hash}, Got: ${signature}`,
      );
      return res
        .status(HttpStatus.FORBIDDEN)
        .send({ message: 'Unauthorized: invalid signature' });
    }

    // Signature valid, process event
    try {
      const event = req.body;
      const result = await this.paymentService.processWebhookEvent(event);
      return res.status(HttpStatus.OK).send(result);
    } catch (error) {
      console.error('Webhook processing error:', error);
      // Still return 200 to prevent Paystack retries for handling errors
      return res.status(HttpStatus.OK).send({
        message: 'Webhook received (processing error)',
        error: error.message,
      });
    }
  }
}
