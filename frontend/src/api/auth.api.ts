
import api from './client';

import {
  clearSession,
  getSession,
  setSession,
} from '../auth/session';

import type {
  LoginInput,
  LoginResponse,
  LogoutResponse,
} from '../types/auth';

/** Đăng nhập và lưu phiên được Backend cấp. */
export async function login(
  data: LoginInput,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    '/auth/login',
    data,
  );

  setSession(response.data);

  return response.data;
}

/** Đăng xuất và thu hồi phiên trên Backend. */
export async function logout(): Promise<LogoutResponse> {
  const session = getSession();

  const response = await api.post<LogoutResponse>(
    '/auth/logout',
  );

  if (getSession() === session) {
    clearSession();
  }

  return response.data;
}
