const router = require('express').Router();
const healthRoutes = require('./health.routes');
const vuViecRoutes = require('./vuViec.routes');

router.use('/health', healthRoutes);
router.use('/vu-viec', vuViecRoutes);

module.exports = router;
