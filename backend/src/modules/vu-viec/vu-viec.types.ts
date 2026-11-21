// Kiểu dữ liệu khớp với bảng vu_viec và ho_so trong database/init/01_schema.sql

export type TrangThaiVuViec = 'moi' | 'dang_xu_ly' | 'hoan_thanh' | 'huy';

export interface VuViec {
  id: number;
  ma_vu_viec: string;
  tieu_de: string;
  mo_ta: string | null;
  trang_thai: TrangThaiVuViec;
  ngay_tiep_nhan: Date;
  nguoi_phu_trach: number | null;
  created_at: Date;
  updated_at: Date;
}

export type VuViecTomTat = Pick<
  VuViec,
  'id' | 'ma_vu_viec' | 'tieu_de' | 'trang_thai' | 'ngay_tiep_nhan' | 'created_at'
>;

export interface HoSo {
  id: number;
  vu_viec_id: number;
  ma_ho_so: string;
  ten_ho_so: string;
  loai_ho_so: string | null;
  duong_dan: string | null;
  nguoi_tao: number | null;
  created_at: Date;
}

export interface VuViecChiTiet extends VuViec {
  ho_so: HoSo[];
}
