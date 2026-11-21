import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// File .env nằm ở thư mục gốc của project (dùng chung cho docker-compose, backend, frontend).
// Đường dẫn đúng cho cả src/config (khi dev) lẫn dist/config (sau khi build).
const envPath = path.resolve(__dirname, '../../../.env');

// Chạy trên máy: đọc file .env ở thư mục gốc.
// Chạy trong Docker: không có file này, biến đã được docker-compose truyền vào container.
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const REQUIRED = [
  'PORT',
  'NODE_ENV',
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'CORS_ORIGIN',
] as const;

const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length) {
  console.error('\n[CẤU HÌNH] Không thể khởi động backend: thiếu biến môi trường.');
  console.error(`[CẤU HÌNH] Biến còn thiếu: ${missing.join(', ')}`);
  if (fs.existsSync(envPath)) {
    console.error(
      `[CẤU HÌNH] Đã tìm thấy file .env tại ${envPath} nhưng thiếu các biến trên. So sánh với .env.example để bổ sung.`,
    );
  } else {
    console.error(`[CẤU HÌNH] Không tìm thấy file .env tại ${envPath}`);
    console.error('[CẤU HÌNH] Tạo file .env bằng cách sao chép .env.example ở thư mục gốc: cp .env.example .env');
  }
  console.error('[CẤU HÌNH] Xem thêm: docs/HUONG_DAN_CAI_DAT.md (mục 3)\n');
  process.exit(1);
}

export interface AppEnv {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
}

// Sau bước kiểm tra ở trên, mọi biến bắt buộc đều đã có giá trị.
const e = process.env as Record<(typeof REQUIRED)[number], string>;

export const env: AppEnv = {
  port: Number(e.PORT),
  nodeEnv: e.NODE_ENV,
  corsOrigin: e.CORS_ORIGIN,
  db: {
    host: e.DB_HOST,
    port: Number(e.DB_PORT),
    user: e.DB_USER,
    password: e.DB_PASSWORD,
    name: e.DB_NAME,
  },
};
