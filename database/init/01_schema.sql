-- ============================================================================
-- ĐỀ TÀI G1.3: HỆ THỐNG QUẢN LÝ VỤ VIỆC VÀ HỒ SƠ NGHIỆP VỤ
-- File: database/init/01_schema.sql
-- Mô tả: Khởi tạo toàn bộ 13 bảng dữ liệu, ràng buộc toàn vẹn, trigger và index
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Xóa các bảng cũ theo thứ tự phụ thuộc nếu chạy lại script thủ công
DROP TABLE IF EXISTS nhat_ky_truy_cap CASCADE;
DROP TABLE IF EXISTS ho_so_phuong_tien CASCADE;
DROP TABLE IF EXISTS phuong_tien_lien_quan CASCADE;
DROP TABLE IF EXISTS ho_so_doi_tuong CASCADE;
DROP TABLE IF EXISTS doi_tuong_lien_quan CASCADE;
DROP TABLE IF EXISTS ho_so_tep_dinh_kem CASCADE;
DROP TABLE IF EXISTS tep_dinh_kem CASCADE;
DROP TABLE IF EXISTS dien_bien_xu_ly CASCADE;
DROP TABLE IF EXISTS ho_so_vu_viec CASCADE;
DROP TABLE IF EXISTS tai_khoan CASCADE;
DROP TABLE IF EXISTS vai_tro_quyen CASCADE;
DROP TABLE IF EXISTS quyen CASCADE;
DROP TABLE IF EXISTS vai_tro CASCADE;

-- ============================================================================
-- 1. NHÓM TÀI KHOẢN & PHÂN QUYỀN (RBAC)
-- ============================================================================

CREATE TABLE vai_tro (
    ma_vai_tro UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ten_vai_tro VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE quyen (
    ma_quyen UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ten_thao_tac VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE vai_tro_quyen (
    ma_vai_tro UUID NOT NULL REFERENCES vai_tro(ma_vai_tro) ON DELETE CASCADE,
    ma_quyen UUID NOT NULL REFERENCES quyen(ma_quyen) ON DELETE CASCADE,
    PRIMARY KEY (ma_vai_tro, ma_quyen)
);

CREATE TABLE tai_khoan (
    ma_tai_khoan UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ten_dang_nhap VARCHAR(50) NOT NULL UNIQUE,
    mat_khau_bam VARCHAR(255) NOT NULL,
    ho_ten VARCHAR(150) NOT NULL,
    trang_thai_hoat_dong BOOLEAN NOT NULL DEFAULT TRUE,
    ma_vai_tro UUID NOT NULL REFERENCES vai_tro(ma_vai_tro) ON DELETE RESTRICT,
    thoi_gian_tao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. NHÓM HỒ SƠ VỤ VIỆC & DIỄN BIẾN XỬ LÝ
-- ============================================================================

-- Sequence hỗ trợ sinh mã hồ sơ tự động khi tạo mới (VD: HS-2026-0001)
CREATE SEQUENCE IF NOT EXISTS seq_ma_ho_so START WITH 1 INCREMENT BY 1;

CREATE TABLE ho_so_vu_viec (
    ma_ho_so VARCHAR(50) PRIMARY KEY DEFAULT (
        'HS-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || LPAD(nextval('seq_ma_ho_so')::TEXT, 4, '0')
    ),
    tieu_de VARCHAR(255) NOT NULL,
    thoi_gian_vu_viec TIMESTAMPTZ NOT NULL,
    dia_diem VARCHAR(255) NOT NULL,
    tom_tat_vu_viec TEXT,
    trang_thai_hien_tai VARCHAR(50) NOT NULL DEFAULT 'TIEP_NHAN',
    ma_can_bo_xu_ly UUID NULL REFERENCES tai_khoan(ma_tai_khoan) ON DELETE RESTRICT,
    thoi_gian_tao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    thoi_gian_cap_nhat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE dien_bien_xu_ly (
    ma_dien_bien UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_ho_so VARCHAR(50) NOT NULL REFERENCES ho_so_vu_viec(ma_ho_so) ON DELETE RESTRICT,
    ma_nguoi_ghi_nhan UUID NOT NULL REFERENCES tai_khoan(ma_tai_khoan) ON DELETE RESTRICT,
    noi_dung_dien_bien TEXT NOT NULL,
    thoi_diem_ghi_nhan TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. NHÓM DỮ LIỆU LIÊN QUAN & BẢNG TRUNG GIAN N-N
-- ============================================================================

CREATE TABLE tep_dinh_kem (
    ma_tep UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ten_tep VARCHAR(255) NOT NULL,
    loai_tep VARCHAR(100) NOT NULL,
    vi_tri_luu_tru TEXT NOT NULL, -- Lưu object key trên MinIO (VD: ho-so/2026/11/bien-ban.pdf)
    mo_ta TEXT,
    dung_luong BIGINT NOT NULL CHECK (dung_luong >= 0),
    ma_nguoi_tai_len UUID NOT NULL REFERENCES tai_khoan(ma_tai_khoan) ON DELETE RESTRICT,
    thoi_gian_tai_len TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ho_so_tep_dinh_kem (
    ma_ho_so VARCHAR(50) NOT NULL REFERENCES ho_so_vu_viec(ma_ho_so) ON DELETE RESTRICT,
    ma_tep UUID NOT NULL REFERENCES tep_dinh_kem(ma_tep) ON DELETE RESTRICT,
    da_go BOOLEAN NOT NULL DEFAULT FALSE,
    thoi_gian_gan TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    thoi_gian_go TIMESTAMPTZ NULL,
    PRIMARY KEY (ma_ho_so, ma_tep)
);

CREATE TABLE doi_tuong_lien_quan (
    ma_doi_tuong UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ho_ten VARCHAR(150) NOT NULL,
    thong_tin_nhan_dien TEXT NOT NULL,
    thong_tin_bo_sung TEXT NULL
);

CREATE TABLE ho_so_doi_tuong (
    ma_ho_so VARCHAR(50) NOT NULL REFERENCES ho_so_vu_viec(ma_ho_so) ON DELETE RESTRICT,
    ma_doi_tuong UUID NOT NULL REFERENCES doi_tuong_lien_quan(ma_doi_tuong) ON DELETE RESTRICT,
    dang_su_dung BOOLEAN NOT NULL DEFAULT TRUE,
    thoi_gian_gan TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    thoi_gian_go TIMESTAMPTZ NULL,
    PRIMARY KEY (ma_ho_so, ma_doi_tuong)
);

CREATE TABLE phuong_tien_lien_quan (
    ma_phuong_tien UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bien_so VARCHAR(30) NULL,
    loai_phuong_tien VARCHAR(100) NOT NULL,
    dac_diem_nhan_dien TEXT NOT NULL,
    thong_tin_bo_sung TEXT NULL
);

CREATE TABLE ho_so_phuong_tien (
    ma_ho_so VARCHAR(50) NOT NULL REFERENCES ho_so_vu_viec(ma_ho_so) ON DELETE RESTRICT,
    ma_phuong_tien UUID NOT NULL REFERENCES phuong_tien_lien_quan(ma_phuong_tien) ON DELETE RESTRICT,
    dang_su_dung BOOLEAN NOT NULL DEFAULT TRUE,
    thoi_gian_gan TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    thoi_gian_go TIMESTAMPTZ NULL,
    PRIMARY KEY (ma_ho_so, ma_phuong_tien)
);

-- ============================================================================
-- 4. NHẬT KÝ TRUY CẬP HỆ THỐNG (AUDIT LOG)
-- ============================================================================

CREATE TABLE nhat_ky_truy_cap (
    ma_nhat_ky UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ma_tai_khoan UUID NULL REFERENCES tai_khoan(ma_tai_khoan) ON DELETE RESTRICT,
    ma_ho_so VARCHAR(50) NULL REFERENCES ho_so_vu_viec(ma_ho_so) ON DELETE RESTRICT,
    thao_tac VARCHAR(100) NOT NULL,
    thoi_diem TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ket_qua VARCHAR(50) NOT NULL
);

-- ============================================================================
-- 5. TRIGGER TỰ ĐỘNG CẬP NHẬT THỜI GIAN & CHỈ MỤC TRA CỨU (INDEXES)
-- ============================================================================

CREATE OR REPLACE FUNCTION fn_cap_nhat_thoi_gian_ho_so()
RETURNS TRIGGER AS $$
BEGIN
    NEW.thoi_gian_cap_nhat = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ho_so_vu_viec_updated
    BEFORE UPDATE ON ho_so_vu_viec
    FOR EACH ROW
    EXECUTE FUNCTION fn_cap_nhat_thoi_gian_ho_so();

CREATE INDEX idx_tai_khoan_vai_tro ON tai_khoan(ma_vai_tro);
CREATE INDEX idx_ho_so_trang_thai ON ho_so_vu_viec(trang_thai_hien_tai);
CREATE INDEX idx_ho_so_thoi_gian ON ho_so_vu_viec(thoi_gian_vu_viec DESC);
CREATE INDEX idx_ho_so_can_bo ON ho_so_vu_viec(ma_can_bo_xu_ly);
CREATE INDEX idx_dien_bien_ho_so ON dien_bien_xu_ly(ma_ho_so, thoi_diem_ghi_nhan DESC);
CREATE INDEX idx_doi_tuong_ho_ten ON doi_tuong_lien_quan(ho_ten);
CREATE INDEX idx_phuong_tien_bien_so ON phuong_tien_lien_quan(bien_so);
CREATE INDEX idx_nhat_ky_thoi_diem ON nhat_ky_truy_cap(thoi_diem DESC);
CREATE INDEX idx_nhat_ky_tai_khoan ON nhat_ky_truy_cap(ma_tai_khoan);
CREATE INDEX idx_nhat_ky_ho_so ON nhat_ky_truy_cap(ma_ho_so);