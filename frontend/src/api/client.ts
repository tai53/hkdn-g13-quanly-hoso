import axios, { isAxiosError } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

/** Lấy câu thông báo lỗi dễ đọc từ lỗi gọi API (backend luôn trả { message }). */
export function getErrorMessage(err: unknown): string {
  if (isAxiosError<{ message?: string }>(err)) {
    return err.response?.data?.message ?? err.message;
  }
  return err instanceof Error ? err.message : String(err);
}

export default api;
