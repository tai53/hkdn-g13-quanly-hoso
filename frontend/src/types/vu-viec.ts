// Kiểu dữ liệu API trả về. Giữ khớp với backend/src/modules/vu-viec/vu-viec.types.ts
// (ngày giờ qua JSON là chuỗi ISO nên ở đây dùng string).

export type TrangThaiVuViec = 'moi' | 'dang_xu_ly' | 'hoan_thanh' | 'huy';

export interface VuViec {
  id: number;
  ma_vu_viec: string;
  tieu_de: string;
  mo_ta: string | null;
  trang_thai: TrangThaiVuViec;
  ngay_tiep_nhan: string;
  nguoi_phu_trach: number | null;
  created_at: string;
  updated_at: string;
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
  created_at: string;
}

export interface VuViecChiTiet extends VuViec {
  ho_so: HoSo[];
}

export interface CreateVuViecInput {
  ma_vu_viec: string;
  tieu_de: string;
  mo_ta?: string;
  ngay_tiep_nhan?: string; // YYYY-MM-DD
}

export interface HealthResponse {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  dbTime?: string;
  message?: string;
}
