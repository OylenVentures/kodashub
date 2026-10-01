export enum DomainStatus {
  PENDING = 'pending', // order submitted to Blesta, awaiting registrar confirmation
  ACTIVE = 'active',
  TRANSFERRING = 'transferring',
  EXPIRED = 'expired',
  CANCELED = 'canceled',
  FAILED = 'failed',
}

export enum DomainOrderType {
  REGISTER = 'register',
  TRANSFER = 'transfer',
}
