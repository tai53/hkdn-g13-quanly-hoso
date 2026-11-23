-- ============================================================================
-- ĐỀ TÀI G1.3: HỆ THỐNG QUẢN LÝ VỤ VIỆC VÀ HỒ SƠ NGHIỆP VỤ
-- File: database/init/02_seed.sql
-- Mô tả: Dữ liệu mẫu khởi tạo (Vai trò, Quyền, Tài khoản, Hồ sơ vụ việc)
-- ============================================================================

-- 1. Khởi tạo 4 vai trò chính theo phạm vi dự án
INSERT INTO vai_tro (ma_vai_tro, ten_vai_tro) VALUES
    ('11111111-1111-1111-1111-111111111101', 'CAN_BO_TIEP_NHAN'),
    ('11111111-1111-1111-1111-111111111102', 'CAN_BO_XU_LY'),
    ('11111111-1111-1111-1111-111111111103', 'NGUOI_QUAN_LY_NGHIEP_VU'),
    ('11111111-1111-1111-1111-111111111104', 'QUAN_TRI_HE_THONG');

-- 2. Khởi tạo danh mục quyền thao tác hệ thống
INSERT INTO quyen (ma_quyen, ten_thao_tac) VALUES
    ('22222222-2222-2222-2222-222222222201', 'TAO_HO_SO'),
    ('22222222-2222-2222-2222-222222222202', 'XEM_HO_SO'),
    ('22222222-2222-2222-2222-222222222203', 'TRA_CUU_HO_SO'),
    ('22222222-2222-2222-2222-222222222204', 'CAP_NHAT_HO_SO'),
    ('22222222-2222-2222-2222-222222222205', 'QUAN_LY_TEP_DINH_KEM'),
    ('22222222-2222-2222-2222-222222222206', 'GO_TEP_DINH_KEM'),
    ('22222222-2222-2222-2222-222222222207', 'QUAN_LY_DOI_TUONG'),
    ('22222222-2222-2222-2222-222222222208', 'GO_DOI_TUONG'),
    ('22222222-2222-2222-2222-222222222209', 'QUAN_LY_PHUONG_TIEN'),
    ('22222222-2222-2222-2222-222222222210', 'GO_PHUONG_TIEN'),
    ('22222222-2222-2222-2222-222222222211', 'GHI_NHAN_DIEN_BIEN'),
    ('22222222-2222-2222-2222-222222222212', 'XEM_LICH_SU_XU_LY'),
    ('22222222-2222-2222-2222-222222222213', 'THEO_DOI_TIEN_DO'),
    ('22222222-2222-2222-2222-222222222214', 'QUAN_LY_TAI_KHOAN'),
    ('22222222-2222-2222-2222-222222222215', 'QUAN_LY_PHAN_QUYEN'),
    ('22222222-2222-2222-2222-222222222216', 'XEM_NHAT_KY_TRUY_CAP');

-- 3. Gán quyền cho từng vai trò (RBAC)
-- Cán bộ tiếp nhận
INSERT INTO vai_tro_quyen (ma_vai_tro, ma_quyen) VALUES
    ('11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201'),
    ('11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222202'),
    ('11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222203');

-- Cán bộ xử lý
INSERT INTO vai_tro_quyen (ma_vai_tro, ma_quyen) VALUES
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222202'),
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222203'),
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222204'),
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222205'),
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222206'),
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222207'),
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222208'),
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222209'),
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222210'),
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222211'),
    ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222212');

-- Người quản lý nghiệp vụ
INSERT INTO vai_tro_quyen (ma_vai_tro, ma_quyen) VALUES
    ('11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222202'),
    ('11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222203'),
    ('11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222212'),
    ('11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222213');

-- Quản trị hệ thống
INSERT INTO vai_tro_quyen (ma_vai_tro, ma_quyen) VALUES
    ('11111111-1111-1111-1111-111111111104', '22222222-2222-2222-2222-222222222214'),
    ('11111111-1111-1111-1111-111111111104', '22222222-2222-2222-2222-222222222215'),
    ('11111111-1111-1111-1111-111111111104', '22222222-2222-2222-2222-222222222216');

-- 4. Khởi tạo 4 tài khoản mẫu (Mật khẩu mẫu bcrypt tương ứng "123456")
INSERT INTO tai_khoan (ma_tai_khoan, ten_dang_nhap, mat_khau_bam, ho_ten, trang_thai_hoat_dong, ma_vai_tro) VALUES
    ('33333333-3333-3333-3333-333333333301', 'tiepnhan01', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Nguyễn Văn An', TRUE, '11111111-1111-1111-1111-111111111101'),
    ('33333333-3333-3333-3333-333333333302', 'xuly01',     '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Trần Minh Bình', TRUE, '11111111-1111-1111-1111-111111111102'),
    ('33333333-3333-3333-3333-333333333303', 'quanly01',   '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Lê Thị Cẩm', TRUE, '11111111-1111-1111-1111-111111111103'),
    ('33333333-3333-3333-3333-333333333304', 'admin',      '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Quản Trị Hệ Thống', TRUE, '11111111-1111-1111-1111-111111111104');

-- 5. Dữ liệu mẫu Hồ sơ vụ việc
INSERT INTO ho_so_vu_viec (ma_ho_so, tieu_de, thoi_gian_vu_viec, dia_diem, tom_tat_vu_viec, trang_thai_hien_tai, ma_can_bo_xu_ly) VALUES
    ('HS-2026-0001', 'Vụ việc mất trộm xe máy tại bãi giữ xe khu A', '2026-11-20 14:30:00+07', 'Bãi giữ xe Khu A, Quận Bình Thạnh, TP.HCM', 'Người dân trình báo mất 01 xe máy Honda Wave Alpha màu xanh đen.', 'DANG_XU_LY', '33333333-3333-3333-3333-333333333302'),
    ('HS-2026-0002', 'Vụ việc va chạm giao thông tại giao lộ Điện Biên Phủ', '2026-11-22 08:15:00+07', 'Ngã tư Điện Biên Phủ - Đinh Tiên Hoàng, TP.HCM', 'Tiếp nhận tin báo va chạm giữa 02 phương tiện, chưa xác định thiệt hại.', 'TIEP_NHAN', NULL);

-- Cập nhật sequence để các hồ sơ tạo mới tiếp theo bắt đầu từ 0003
SELECT setval('seq_ma_ho_so', 2, true);

-- 6. Dữ liệu mẫu Diễn biến xử lý
INSERT INTO dien_bien_xu_ly (ma_ho_so, ma_nguoi_ghi_nhan, noi_dung_dien_bien) VALUES
    ('HS-2026-0001', '33333333-3333-3333-3333-333333333302', 'Đã tiếp nhận hồ sơ, trích xuất dữ liệu camera khu vực cổng ra vào bãi xe.');

-- 7. Dữ liệu mẫu Đối tượng & Phương tiện liên quan
INSERT INTO doi_tuong_lien_quan (ma_doi_tuong, ho_ten, thong_tin_nhan_dien, thong_tin_bo_sung) VALUES
    ('44444444-4444-4444-4444-444444444401', 'Phạm Hoàng Nam', 'CCCD: 079098001234 - Sinh năm 1998 - Nam', 'Người trình báo vụ việc, SĐT: 0909123456');

INSERT INTO ho_so_doi_tuong (ma_ho_so, ma_doi_tuong, dang_su_dung) VALUES
    ('HS-2026-0001', '44444444-4444-4444-4444-444444444401', TRUE);

INSERT INTO phuong_tien_lien_quan (ma_phuong_tien, bien_so, loai_phuong_tien, dac_diem_nhan_dien, thong_tin_bo_sung) VALUES
    ('55555555-5555-5555-5555-555555555501', '59S2-123.45', 'Xe mô tô 2 bánh', 'Honda Wave Alpha, màu xanh đen', 'Phương tiện bị mất trộm theo trình báo');

INSERT INTO ho_so_phuong_tien (ma_ho_so, ma_phuong_tien, dang_su_dung) VALUES
    ('HS-2026-0001', '55555555-5555-5555-5555-555555555501', TRUE);

-- 8. Dữ liệu mẫu Nhật ký truy cập hệ thống
INSERT INTO nhat_ky_truy_cap (ma_tai_khoan, ma_ho_so, thao_tac, ket_qua) VALUES
    ('33333333-3333-3333-3333-333333333301', NULL, 'DANG_NHAP', 'THANH_CONG'),
    ('33333333-3333-3333-3333-333333333301', 'HS-2026-0001', 'TAO_HO_SO_VU_VIEC', 'THANH_CONG'),
    ('33333333-3333-3333-3333-333333333302', 'HS-2026-0001', 'GHI_NHAN_DIEN_BIEN', 'THANH_CONG');