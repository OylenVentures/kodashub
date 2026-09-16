import { Module, OnModuleInit } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../cart/entities/cart.entity';
import { Domain } from '../domain/entities/domain.entity';
import { User } from '../user/entities/user.entity';
import { Payment } from './entities/payment.entity';
import { PaymentEvent } from './entities/payment-event.entity';
import { DomainService } from '../domain/domain.service';
import { FulfillmentHandlerRegistry } from './registry/fulfillment-handler.registry';
import { DomainFulfillmentHandler } from '../domain/handlers/domain-fulfillment.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, Domain, User, Payment, PaymentEvent]),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    DomainService,
    FulfillmentHandlerRegistry,
    DomainFulfillmentHandler,
  ],
})
export class PaymentModule implements OnModuleInit {
  constructor(
    private fulfillmentRegistry: FulfillmentHandlerRegistry,
    private domainHandler: DomainFulfillmentHandler,
  ) {}

  /**
   * Register all fulfillment handlers when module initializes
   * New service handlers can be added here
   */
  onModuleInit() {
    // Register domain fulfillment handler
    this.fulfillmentRegistry.register(this.domainHandler);

    // Future: Register other service handlers here
    // this.fulfillmentRegistry.register(this.hostingHandler);
    // this.fulfillmentRegistry.register(this.sslHandler);
    // etc.
  }
}
