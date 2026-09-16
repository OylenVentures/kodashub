import { Injectable, Logger } from '@nestjs/common';
import { IFulfillmentHandler } from '../../payment/interfaces/fulfillment-handler.interface';

/**
 * Hosting fulfillment handler
 * Handles provisioning of hosting service purchases
 *
 * USAGE: When a customer purchases a hosting plan:
 * 1. Payment is verified
 * 2. fulfillService() looks up this handler for serviceType='hosting'
 * 3. fulfill() method provisions the hosting account
 * 4. Returns result with serviceId for reference
 *
 * Example metadata structure:
 * {
 *   plan: 'basic' | 'professional' | 'business',
 *   diskSpace: 50,  // GB
 *   bandwidth: 500, // GB
 *   emailAccounts: 10,
 *   duration: 1,    // years
 *   cPanel: true
 * }
 */
@Injectable()
export class HostingFulfillmentHandler implements IFulfillmentHandler {
  private readonly logger = new Logger(HostingFulfillmentHandler.name);

  constructor() {
    // TODO: Inject HostingService when created
    // private hostingService: HostingService
  }

  getServiceType(): string {
    return 'hosting';
  }

  async fulfill(metadata: any, userId: string) {
    if (!metadata.plan || !metadata.duration) {
      throw new Error(
        'Hosting fulfillment requires "plan" and "duration" in metadata',
      );
    }

    this.logger.log(
      `Provisioning hosting: ${metadata.plan} for user ${userId}`,
    );

    try {
      // TODO: Call hostingService.provision() when service is created
      // const result = await this.hostingService.provision({
      //   plan: metadata.plan,
      //   diskSpace: metadata.diskSpace,
      //   bandwidth: metadata.bandwidth,
      //   emailAccounts: metadata.emailAccounts,
      //   duration: metadata.duration,
      //   cPanel: metadata.cPanel,
      // }, userId);

      // Placeholder response
      const result = {
        id: `hosting-${Date.now()}`,
        plan: metadata.plan,
        cPanelUrl: `https://cpanel-${Date.now()}.hosting.example.com`,
        status: 'active',
      };

      return {
        message: 'Hosting account provisioned successfully',
        result,
        serviceId: result.id,
      };
    } catch (error) {
      this.logger.error(
        `Hosting provisioning failed for ${metadata.plan}: ${error.message}`,
      );
      throw error;
    }
  }

  async handleFailure(metadata: any, userId: string, reason: string) {
    this.logger.warn(
      `Hosting fulfillment failed for ${metadata.plan} (user: ${userId}): ${reason}`,
    );
    // Future: Send notification email to user, log to support queue, cleanup partial provisioning
  }

  async verify(metadata: any, userId: string): Promise<boolean> {
    // Future: Query hosting provider API to verify account is active
    this.logger.debug(`Verifying hosting account for plan ${metadata.plan}`);
    return true;
  }
}
