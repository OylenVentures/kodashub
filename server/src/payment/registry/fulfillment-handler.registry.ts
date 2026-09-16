import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { IFulfillmentHandler } from '../interfaces/fulfillment-handler.interface';

/**
 * Registry pattern for fulfillment handlers
 * Allows registering handlers for different service types
 * Enables easy addition of new services without modifying PaymentService
 */
@Injectable()
export class FulfillmentHandlerRegistry {
  private readonly logger = new Logger(FulfillmentHandlerRegistry.name);
  private readonly handlers = new Map<string, IFulfillmentHandler>();

  /**
   * Register a fulfillment handler for a service type
   */
  register(handler: IFulfillmentHandler): void {
    const serviceType = handler.getServiceType();
    if (this.handlers.has(serviceType)) {
      this.logger.warn(
        `Overwriting existing handler for service type: ${serviceType}`,
      );
    }
    this.handlers.set(serviceType, handler);
    this.logger.log(
      `Registered fulfillment handler for service type: ${serviceType}`,
    );
  }

  /**
   * Get handler for a specific service type
   */
  getHandler(serviceType: string): IFulfillmentHandler {
    const handler = this.handlers.get(serviceType);
    if (!handler) {
      throw new BadRequestException(
        `No fulfillment handler registered for service type: ${serviceType}. Supported types: ${Array.from(this.handlers.keys()).join(', ')}`,
      );
    }
    return handler;
  }

  /**
   * Check if handler exists for service type
   */
  hasHandler(serviceType: string): boolean {
    return this.handlers.has(serviceType);
  }

  /**
   * Get all registered service types
   */
  getRegisteredServiceTypes(): string[] {
    return Array.from(this.handlers.keys());
  }
}
