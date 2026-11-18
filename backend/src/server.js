const env = require('./config/env'); // kiểm tra biến môi trường, thiếu là dừng ngay
const app = require('./app');
const { checkConnection } = require('./config/db');

app.listen(env.port, async () => {
  console.log(`[API] Đang chạy tại http://localhost:${env.port}`);
  try {
    const now = await checkConnection();
    console.log(`[DB] Kết nối PostgreSQL thành công (${now.toISOString()})`);
  } catch (err) {
    console.error('[DB] Không kết nối được PostgreSQL:', err.message || err.code);
  }
});
