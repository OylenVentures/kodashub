/**
 * Fulfillment handler interface for service-agnostic payment fulfillment
 * Each service (domain, hosting, ssl, email, etc.) implements this interface
 */
export interface IFulfillmentHandler {
  /**
   * Get the service type identifier (e.g., 'domain', 'hosting', 'ssl')
   */
  getServiceType(): string;

  /**
   * Execute fulfillment for a completed payment
   * @param metadata - Service-specific data from the cart item
   * @param userId - User ID for ownership
   * @returns Promise with fulfillment result
   */
  fulfill(
    metadata: any,
    userId: string,
  ): Promise<{
    message: string;
    result?: any;
    serviceId?: string; // ID of created resource
  }>;

  /**
   * Handle failure or reversal of a payment
   * Cleanup if needed (e.g., cancel provisioning, send refund email)
   * @param metadata - Service-specific data
   * @param userId - User ID
   * @param reason - Reason for failure
   */
  handleFailure?(metadata: any, userId: string, reason: string): Promise<void>;

  /**
   * Verify fulfillment status (optional, for reconciliation)
   * @param metadata - Service-specific data
   * @param userId - User ID
   * @returns Promise with verification result
   */
  verify?(metadata: any, userId: string): Promise<boolean>;
}
