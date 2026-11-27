
import type {
  AuthSession,
  LoginResponse,
} from '../types/auth';

let currentSession: AuthSession | null = null;

const listeners = new Set<() => void>();

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

/** Lưu phiên đăng nhập trong bộ nhớ. */
export function setSession(
  response: LoginResponse,
): void {
  currentSession = {
    accessToken: response.access_token,
    expiresAt:
      Date.now() + response.expires_in * 1000,
    user: response.user,
  };

  notifyListeners();
}

/** Đọc phiên hiện tại. */
export function getSession(): AuthSession | null {
  return currentSession;
}

/** Đọc Token nếu phiên chưa hết hạn. */
export function getAccessToken(): string | null {
  if (!currentSession) {
    return null;
  }

  if (Date.now() >= currentSession.expiresAt) {
    clearSession();
    return null;
  }

  return currentSession.accessToken;
}

/** Xóa phiên đăng nhập khỏi Frontend. */
export function clearSession(): void {
  if (currentSession === null) {
    return;
  }

  currentSession = null;
  notifyListeners();
}

/** Cho phép React theo dõi thay đổi của phiên. */
export function subscribeSession(
  listener: () => void,
): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
