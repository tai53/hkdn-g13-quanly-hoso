-- Dữ liệu mẫu để phát triển (KHÔNG dùng cho production)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, ho_ten, email, vai_tro) VALUES
  ('admin', 'chua_ma_hoa_thay_bang_bcrypt', 'Quản trị viên', 'admin@example.com', 'admin')
ON CONFLICT DO NOTHING;

INSERT INTO vu_viec (ma_vu_viec, tieu_de, mo_ta, trang_thai, nguoi_phu_trach) VALUES
  ('VV-2026-001', 'Tiếp nhận đơn khiếu nại', 'Vụ việc mẫu số 1', 'moi', 1),
  ('VV-2026-002', 'Xác minh hồ sơ đất đai', 'Vụ việc mẫu số 2', 'dang_xu_ly', 1)
ON CONFLICT DO NOTHING;

INSERT INTO ho_so (vu_viec_id, ma_ho_so, ten_ho_so, loai_ho_so, nguoi_tao) VALUES
  (1, 'HS-001', 'Đơn khiếu nại gốc', 'don_thu', 1),
  (2, 'HS-002', 'Biên bản xác minh', 'bien_ban', 1)
ON CONFLICT DO NOTHING;
