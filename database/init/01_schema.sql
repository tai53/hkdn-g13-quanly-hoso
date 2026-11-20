-- =====================================================
-- Schema: Hệ thống quản lý vụ việc và hồ sơ nghiệp vụ
-- File này tự chạy khi container PostgreSQL khởi tạo LẦN ĐẦU
-- (khi volume dữ liệu còn trống).
-- =====================================================

CREATE TABLE IF NOT EXISTS nguoi_dung (
    id            SERIAL PRIMARY KEY,
    ten_dang_nhap VARCHAR(50)  NOT NULL UNIQUE,
    mat_khau_hash VARCHAR(255) NOT NULL,
    ho_ten        VARCHAR(100) NOT NULL,
    email         VARCHAR(100) UNIQUE,
    vai_tro       VARCHAR(20)  NOT NULL DEFAULT 'nhan_vien'
                  CHECK (vai_tro IN ('admin', 'quan_ly', 'nhan_vien')),
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vu_viec (
    id              SERIAL PRIMARY KEY,
    ma_vu_viec      VARCHAR(30)  NOT NULL UNIQUE,
    tieu_de         VARCHAR(255) NOT NULL,
    mo_ta           TEXT,
    trang_thai      VARCHAR(20)  NOT NULL DEFAULT 'moi'
                    CHECK (trang_thai IN ('moi', 'dang_xu_ly', 'hoan_thanh', 'huy')),
    ngay_tiep_nhan  DATE         NOT NULL DEFAULT CURRENT_DATE,
    nguoi_phu_trach INTEGER      REFERENCES nguoi_dung(id) ON DELETE SET NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ho_so (
    id          SERIAL PRIMARY KEY,
    vu_viec_id  INTEGER      NOT NULL REFERENCES vu_viec(id) ON DELETE CASCADE,
    ma_ho_so    VARCHAR(30)  NOT NULL UNIQUE,
    ten_ho_so   VARCHAR(255) NOT NULL,
    loai_ho_so  VARCHAR(50),
    duong_dan   VARCHAR(500),
    nguoi_tao   INTEGER      REFERENCES nguoi_dung(id) ON DELETE SET NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vu_viec_trang_thai ON vu_viec(trang_thai);
CREATE INDEX IF NOT EXISTS idx_ho_so_vu_viec_id  ON ho_so(vu_viec_id);
