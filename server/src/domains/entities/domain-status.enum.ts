export enum DomainStatus {
  PENDING = 'pending', // order submitted to the registrar, awaiting confirmation
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
