// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  console.error('[ERROR]', err);
  if (err.code === '23505') {
    return res.status(409).json({ message: 'Dữ liệu đã tồn tại', detail: err.detail });
  }
  res.status(err.status || 500).json({ message: err.message || 'Lỗi máy chủ' });
};
