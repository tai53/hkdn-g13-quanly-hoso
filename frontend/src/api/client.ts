
import axios, { isAxiosError } from 'axios';

import {
  clearSession,
  getAccessToken,
  getSession,
} from '../auth/session';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/** Gắn Bearer Token trước khi gửi Request. */
api.interceptors.request.use((config) => {
  const isPublicEndpoint =
    config.url === '/auth/login' ||
    config.url === '/health';

  if (!isPublicEndpoint) {
    const token = getAccessToken();

    if (token) {
      config.headers.set(
        'Authorization',
        `Bearer ${token}`,
      );
    }
  }

  return config;
});

/** Xử lý lỗi xác thực từ Backend. */
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config?.url !== '/auth/login'
    ) {
      const sentAuthorization =
        error.config?.headers?.get('Authorization');

      const activeSession = getSession();

      if (
        activeSession &&
        sentAuthorization ===
          `Bearer ${activeSession.accessToken}`
      ) {
        clearSession();
      }
    }

    return Promise.reject(error);
  },
);

/** Chuyển lỗi API thành thông báo dễ đọc. */
export function getErrorMessage(
  error: unknown,
): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === 'string' && message) {
      return message;
    }

    if (Array.isArray(message)) {
      return message.join('; ');
    }

    if (error.code === 'ECONNABORTED') {
      return 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.';
    }

    if (!error.response) {
      return 'Không thể kết nối Backend. Vui lòng kiểm tra kết nối.';
    }

    return error.message;
  }

  return error instanceof Error
    ? error.message
    : String(error);
}

export default api;
