export interface AuthTokenPayload {
  sub?: string;
  jti: string;
  username: string;
  roleCode: string;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  roleCode: string;
  jti: string;
}

export interface AuthenticatedRequest {
  headers: { authorization?: string };
  user: AuthenticatedUser;
}
