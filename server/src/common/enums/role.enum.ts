export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin',
  SUPPORT_AGENT = 'support_agent',
  DEVELOPER = 'developer',
  DEVOPS_ENGINEER = 'devops_engineer',
}

/** Any role that counts as "staff" for ticket-answering purposes. */
export const STAFF_ROLES: UserRole[] = [
  UserRole.ADMIN,
  UserRole.SUPPORT_AGENT,
  UserRole.DEVELOPER,
  UserRole.DEVOPS_ENGINEER,
];

export function isStaffRole(role: UserRole): boolean {
  return STAFF_ROLES.includes(role);
}
