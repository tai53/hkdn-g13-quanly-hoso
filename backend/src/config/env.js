const fs = require('fs');
const path = require('path');

// File .env nằm ở thư mục gốc của project (dùng chung cho docker-compose, backend, frontend).
const envPath = path.resolve(__dirname, '../../../.env');

// Chạy trên máy: đọc file .env ở thư mục gốc.
// Chạy trong Docker: không có file này, biến đã được docker-compose truyền vào container.
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
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
];

const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length) {
  console.error('\n[CẤU HÌNH] Không thể khởi động backend: thiếu biến môi trường.');
  console.error(`[CẤU HÌNH] Biến còn thiếu: ${missing.join(', ')}`);
  if (fs.existsSync(envPath)) {
    console.error(`[CẤU HÌNH] Đã tìm thấy file .env tại ${envPath} nhưng thiếu các biến trên. So sánh với .env.example để bổ sung.`);
  } else {
    console.error(`[CẤU HÌNH] Không tìm thấy file .env tại ${envPath}`);
    console.error('[CẤU HÌNH] Tạo file .env bằng cách sao chép .env.example ở thư mục gốc: cp .env.example .env');
  }
  console.error('[CẤU HÌNH] Xem thêm: docs/HUONG_DAN_CAI_DAT.md (mục 3)\n');
  process.exit(1);
}

module.exports = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  corsOrigin: process.env.CORS_ORIGIN,
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
};
