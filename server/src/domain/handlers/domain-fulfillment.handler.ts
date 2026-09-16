import { Injectable, Logger } from '@nestjs/common';
import { DomainService } from '../../domain/domain.service';
import { IFulfillmentHandler } from '../../payment/interfaces/fulfillment-handler.interface';

/**
 * Domain fulfillment handler
 * Handles registration of domain purchases
 */
@Injectable()
export class DomainFulfillmentHandler implements IFulfillmentHandler {
  private readonly logger = new Logger(DomainFulfillmentHandler.name);

  constructor(private domainService: DomainService) {}

  getServiceType(): string {
    return 'domain';
  }

  async fulfill(metadata: any, userId: string) {
    if (!metadata.name || !metadata.regPeriod) {
      throw new Error(
        'Domain fulfillment requires "name" and "regPeriod" in metadata',
      );
    }

    this.logger.log(`Fulfilling domain: ${metadata.name} for user ${userId}`);

    const response = await this.domainService.register(
      {
        name: metadata.name,
        regPeriod: metadata.regPeriod.toString(),
        status: 'active',
      },
      userId,
    );

    // response structure: { message, result } where result is the Domain entity
    return {
      message: response.message || 'Domain registered successfully',
      result: response.result,
      serviceId: response.result?.id, // Domain entity ID
    };
  }

  async handleFailure(metadata: any, userId: string, reason: string) {
    this.logger.warn(
      `Domain fulfillment failed for ${metadata.name} (user: ${userId}): ${reason}`,
    );
    // Future: Send notification email to user, log to support queue
    // const response = await this.domainService.updateDomainStatus(
    //   {
    //     status: 'active',
    //   },
    //   userId,
    // );

    // return {
    //   message: response.message || 'Domain status updated successfully',
    // };
  }

  async verify(metadata: any, userId: string): Promise<boolean> {
    // Future: Query domain registry to verify registration status
    this.logger.debug(`Verifying domain registration for ${metadata.name}`);
    return true;
  }
}
