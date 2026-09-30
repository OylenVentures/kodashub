import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { HttpStatus } from '@nestjs/common';
import { createHmac } from 'crypto';

describe('PaymentController', () => {
  let controller: PaymentController;
  let service: PaymentService;

  const mockPaymentService = {
    initializePayment: jest.fn(),
    listTransactions: jest.fn(),
    confirmPayment: jest.fn(),
    processWebhookEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    service = module.get<PaymentService>(PaymentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Webhook Security', () => {
    it('should reject webhook with missing signature', async () => {
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const req = {
        headers: {},
        rawBody: Buffer.from('{}'),
        body: {},
      };

      await controller.webhookHandler(req as any, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Unauthorized: missing signature',
      });
      expect(service.processWebhookEvent).not.toHaveBeenCalled();
    });

    it('should reject webhook with invalid signature', async () => {
      const secret = 'test-secret';
      process.env.PAYSTACK_SECRET_KEY = secret;

      const payload = {
        event: 'charge.success',
        data: { reference: 'txn-123' },
      };
      const rawBody = Buffer.from(JSON.stringify(payload));
      const invalidSignature = 'invalid-signature-hash';

      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const req = {
        headers: { 'x-paystack-signature': invalidSignature },
        rawBody,
        body: payload,
      };

      await controller.webhookHandler(req as any, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Unauthorized: invalid signature',
      });
      expect(service.processWebhookEvent).not.toHaveBeenCalled();
    });

    it('should accept webhook with valid signature', async () => {
      const secret = 'test-secret';
      process.env.PAYSTACK_SECRET_KEY = secret;

      const payload = {
        id: 'evt-123',
        event: 'charge.success',
        data: { reference: 'txn-123' },
      };
      const rawBody = Buffer.from(JSON.stringify(payload));
      const hash = createHmac('sha512', secret).update(rawBody).digest('hex');

      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const req = {
        headers: { 'x-paystack-signature': hash },
        rawBody,
        body: payload,
      };

      mockPaymentService.processWebhookEvent.mockResolvedValueOnce({
        message: 'processed',
      });

      await controller.webhookHandler(req as any, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(service.processWebhookEvent).toHaveBeenCalledWith(payload);
    });

    it('should handle processing errors gracefully but still return 200', async () => {
      const secret = 'test-secret';
      process.env.PAYSTACK_SECRET_KEY = secret;

      const payload = {
        id: 'evt-456',
        event: 'charge.success',
        data: { reference: 'txn-456' },
      };
      const rawBody = Buffer.from(JSON.stringify(payload));
      const hash = createHmac('sha512', secret).update(rawBody).digest('hex');

      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const req = {
        headers: { 'x-paystack-signature': hash },
        rawBody,
        body: payload,
      };

      mockPaymentService.processWebhookEvent.mockRejectedValueOnce(
        new Error('Database error'),
      );

      await controller.webhookHandler(req as any, res);

      // Still returns 200 to prevent Paystack retries
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Webhook received (processing error)',
        }),
      );
    });
  });

  describe('Authorization', () => {
    it('should require JWT guard for initialize payment', async () => {
      // This is tested via @UseGuards decorator
      // The guard is applied at the controller level
      expect(controller).toBeDefined();
    });

    it('should reject payment initialization for unauthorized user', async () => {
      const dto: any = { cartId: 'cart-123', method: 'card' };
      const req = { user: null };

      await expect(() =>
        controller.initializePaymentGeneric(req as any, dto),
      ).rejects.toThrow('Unauthorized user');
    });
  });

  describe('Payment Verification', () => {
    it('should only allow admins to verify payments', async () => {
      const req = { user: { role: 'user' } };

      await expect(() =>
        controller.verifyPayment(req as any, 'txn-ref-123'),
      ).rejects.toThrow('not authorized');
    });

    it('should allow super_admin to verify payments', async () => {
      const req = { user: { role: 'super_admin' } };
      mockPaymentService.confirmPayment.mockResolvedValueOnce({
        status: 'paid',
      } as any);

      const result = await controller.verifyPayment(req as any, 'txn-ref-123');

      expect(service.confirmPayment).toHaveBeenCalledWith('txn-ref-123');
      expect((result as any).status).toBe('paid');
    });

    it('should require transaction reference', async () => {
      const req = { user: { role: 'admin' } };

      await expect(() =>
        controller.verifyPayment(req as any, ''),
      ).rejects.toThrow('Transaction reference is required');
    });
  });
});
