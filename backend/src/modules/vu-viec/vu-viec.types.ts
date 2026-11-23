// Kiểu dữ liệu khớp với bảng ho_so_vu_viec và các bảng liên quan trong database/init/01_schema.sql

export type TrangThaiHoSo = 'TIEP_NHAN' | 'DANG_XU_LY' | 'CHO_DUYET' | 'DA_DONG' | string;

export interface HoSoVuViec {
  ma_ho_so: string;
  tieu_de: string;
  thoi_gian_vu_viec: Date;
  dia_diem: string;
  tom_tat_vu_viec: string | null;
  trang_thai_hien_tai: TrangThaiHoSo;
  ma_can_bo_xu_ly: string | null;
  thoi_gian_tao: Date;
  thoi_gian_cap_nhat: Date;
}

export type HoSoVuViecTomTat = Pick<
  HoSoVuViec,
  | 'ma_ho_so'
  | 'tieu_de'
  | 'thoi_gian_vu_viec'
  | 'dia_diem'
  | 'trang_thai_hien_tai'
  | 'thoi_gian_tao'
>;

export interface DienBienXuLy {
  ma_dien_bien: string;
  ma_ho_so: string;
  ma_nguoi_ghi_nhan: string;
  nguoi_ghi_nhan?: string;
  noi_dung_dien_bien: string;
  thoi_diem_ghi_nhan: Date;
}

export interface TepDinhKem {
  ma_tep: string;
  ten_tep: string;
  loai_tep: string;
  vi_tri_luu_tru: string;
  mo_ta: string | null;
  dung_luong: number;
  ma_nguoi_tai_len: string;
  thoi_gian_tai_len: Date;
}

export interface DoiTuongLienQuan {
  ma_doi_tuong: string;
  ho_ten: string;
  thong_tin_nhan_dien: string;
  thong_tin_bo_sung: string | null;
}

export interface PhuongTienLienQuan {
  ma_phuong_tien: string;
  bien_so: string | null;
  loai_phuong_tien: string;
  dac_diem_nhan_dien: string;
  thong_tin_bo_sung: string | null;
}

export interface HoSoVuViecChiTiet extends HoSoVuViec {
  ten_can_bo_xu_ly?: string | null;
  dien_bien_xu_ly: DienBienXuLy[];
  tep_dinh_kem: TepDinhKem[];
  doi_tuong_lien_quan: DoiTuongLienQuan[];
  phuong_tien_lien_quan: PhuongTienLienQuan[];
}

// Alias giữ tương thích nếu có file khác đang import tên cũ
export type VuViec = HoSoVuViec;
export type VuViecTomTat = HoSoVuViecTomTat;
export type VuViecChiTiet = HoSoVuViecChiTiet;