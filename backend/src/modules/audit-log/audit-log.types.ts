
export type AuditAction = 'LOGIN' | 'LOGOUT';

export type AuditResult = 'SUCCESS' | 'FAILED';

export interface CreateAuditLogInput {
  userId: string | null;
  username: string | null;
  action: AuditAction;
  result: AuditResult;
  ipAddress: string | null;
}
