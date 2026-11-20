const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.name,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('[DB] Lỗi kết nối không mong muốn:', err.message);
});

const query = (text, params) => pool.query(text, params);

const checkConnection = async () => {
  const { rows } = await pool.query('SELECT NOW() AS now');
  return rows[0].now;
};

module.exports = { pool, query, checkConnection };
