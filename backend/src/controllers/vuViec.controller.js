const db = require('../config/db');

// GET /api/vu-viec
exports.getAll = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, ma_vu_viec, tieu_de, trang_thai, ngay_tiep_nhan, created_at
       FROM vu_viec ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/vu-viec/:id (kèm danh sách hồ sơ)
exports.getById = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT * FROM vu_viec WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy vụ việc' });

    const hoSo = await db.query(
      'SELECT * FROM ho_so WHERE vu_viec_id = $1 ORDER BY created_at DESC',
      [req.params.id]
    );
    res.json({ ...rows[0], ho_so: hoSo.rows });
  } catch (err) {
    next(err);
  }
};

// POST /api/vu-viec
exports.create = async (req, res, next) => {
  try {
    const { ma_vu_viec, tieu_de, mo_ta, ngay_tiep_nhan } = req.body;
    if (!ma_vu_viec || !tieu_de) {
      return res.status(400).json({ message: 'ma_vu_viec và tieu_de là bắt buộc' });
    }
    const { rows } = await db.query(
      `INSERT INTO vu_viec (ma_vu_viec, tieu_de, mo_ta, ngay_tiep_nhan)
       VALUES ($1, $2, $3, COALESCE($4::date, CURRENT_DATE)) RETURNING *`,
      [ma_vu_viec, tieu_de, mo_ta || null, ngay_tiep_nhan || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};
