import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export default defineConfig(({ mode }) => {
  // Đọc file .env ở thư mục gốc của project (dùng chung với backend và docker-compose).
  // Chạy trong Docker: không có file này, biến đã được docker-compose truyền vào container.
  const env = loadEnv(mode, rootDir, 'VITE_');

  if (!env.VITE_API_URL) {
    throw new Error(
      '[CẤU HÌNH] Thiếu biến VITE_API_URL.\n' +
        `Không tìm thấy file .env (hoặc file thiếu biến này) tại: ${rootDir}\n` +
        'Tạo file .env bằng cách sao chép .env.example ở thư mục gốc: cp .env.example .env\n' +
        'Xem thêm: docs/HUONG_DAN_CAI_DAT.md (mục 3)'
    );
  }

  return {
    plugins: [react()],
    envDir: rootDir, // đọc file .env ở thư mục gốc của project
    server: {
      host: true, // cần để truy cập được khi chạy trong Docker
      port: 5173,
      watch: { usePolling: true }, // hot-reload ổn định trên Windows + Docker
    },
  };
});
