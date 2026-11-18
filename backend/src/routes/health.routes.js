const router = require('express').Router();
const { checkConnection } = require('../config/db');

// GET /api/health - kiểm tra API và kết nối database
router.get('/', async (req, res) => {
  try {
    const dbTime = await checkConnection();
    res.json({ status: 'ok', database: 'connected', dbTime });
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'disconnected', message: err.message || err.code });
  }
});

module.exports = router;
