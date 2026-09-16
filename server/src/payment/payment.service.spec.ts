import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentEvent } from './entities/payment-event.entity';
import { Cart } from '../cart/entities/cart.entity';
import { Domain } from '../domain/entities/domain.entity';
import { User } from '../user/entities/user.entity';
import { DomainService } from '../domain/domain.service';
import { FulfillmentHandlerRegistry } from './registry/fulfillment-handler.registry';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PaymentService - Production Idempotency Tests', () => {
  let service: PaymentService;
  let paymentRepo: Repository<Payment>;
  let paymentEventRepo: Repository<PaymentEvent>;
  let cartRepo: Repository<Cart>;
  let domainService: DomainService;
  let dataSource: DataSource;

  const mockUser: User = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
  } as User;

  const mockCart: Cart = {
    id: 'cart-123',
    user: mockUser,
    serviceType: 'domain',
    price: 500,
    metadata: {
      name: 'example.com',
      regPeriod: 1,
      nameservers: [],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Cart;

  const mockPaystackResponse = {
    status: true,
    data: {
      authorization_url: 'https://checkout.paystack.com/xyz',
      reference: 'txn-ref-123',
    },
  };

  beforeEach(async () => {
    const mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Payment),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PaymentEvent),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Cart),
          useValue: {
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Domain),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: DomainService,
          useValue: {
            register: jest
              .fn()
              .mockResolvedValue({ message: 'Domain registered' }),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(() => mockQueryRunner),
          },
        },
        {
          provide: FulfillmentHandlerRegistry,
          useValue: {
            register: jest.fn(),
            getHandler: jest.fn().mockReturnValue({
              fulfill: jest.fn().mockResolvedValue({
                message: 'Service fulfilled successfully',
                result: { id: 'service-123' },
              }),
            }),
            hasHandler: jest.fn().mockReturnValue(true),
            getRegisteredServiceTypes: jest.fn().mockReturnValue(['domain']),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepo = module.get<Repository<Payment>>(getRepositoryToken(Payment));
    paymentEventRepo = module.get<Repository<PaymentEvent>>(
      getRepositoryToken(PaymentEvent),
    );
    cartRepo = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    domainService = module.get<DomainService>(DomainService);
    dataSource = module.get<DataSource>(DataSource);
  });

  describe('Webhook Idempotency', () => {
    it('should not process duplicate webhook events', async () => {
      const payload = {
        id: 'evt-123',
        event: 'charge.success',
        data: { reference: 'txn-ref-123' },
      };

      const existingEvent: PaymentEvent = {
        paystackEventId: payload.id,
        processingStatus: 'success',
      } as PaymentEvent;

      (paymentEventRepo.findOne as jest.Mock).mockResolvedValue(existingEvent);

      const result = await service.processWebhookEvent(payload);

      expect(result.isRetry).toBe(true);
      expect(domainService.register).not.toHaveBeenCalled();
    });

    it('should mark domain registration failed payments appropriately', async () => {
      const payload = {
        id: 'evt-456',
        event: 'transfer.failed',
        data: { reference: 'txn-ref-456' },
      };

      const payment: Payment = {
        id: 'payment-456',
        transactionRef: 'txn-ref-456',
        status: 'pending',
      } as Payment;

      (paymentEventRepo.findOne as jest.Mock).mockResolvedValue(null);
      (paymentEventRepo.create as jest.Mock).mockReturnValue({
        paystackEventId: payload.id,
        processingStatus: 'processing',
      });
      (paymentRepo.findOne as jest.Mock).mockResolvedValue(payment);

      await service.processWebhookEvent(payload);

      expect(paymentRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'failed' }),
      );
    });
  });

  describe('Payment Initialization Safety', () => {
    it('should preserve cart during payment initialization', async () => {
      const dto: any = { cartId: 'cart-123', method: 'card' };
      const queryRunner = dataSource.createQueryRunner();

      (queryRunner.manager.findOne as jest.Mock)
        .mockResolvedValueOnce(mockCart)
        .mockResolvedValueOnce(null); // No existing payment

      (queryRunner.manager.create as jest.Mock).mockReturnValue({
        id: 'payment-123',
        status: 'pending',
      });

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockPaystackResponse,
      } as any);

      await service.initializePayment(dto, mockUser.id);

      // Verify cart was NOT deleted
      expect(cartRepo.remove).not.toHaveBeenCalled();
    });
  });

  describe('Fulfillment Separation', () => {
    it('should keep payment in paid state if fulfillment fails', async () => {
      (domainService.register as jest.Mock).mockRejectedValueOnce(
        new Error('Provider error'),
      );

      const payment: Payment = {
        id: 'payment-789',
        transactionRef: 'txn-ref-789',
        status: 'pending',
        cart: mockCart as any,
        user: mockUser,
      } as Payment;

      (paymentRepo.findOne as jest.Mock).mockResolvedValue(payment);

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { status: 'success' } }),
      } as any);

      const result: any = await service.verifyPayment('txn-ref-789');

      expect(result.paymentStatus).toBe('paid');
      expect(result.fulfillmentError).toBeDefined();
    });
  });
});
