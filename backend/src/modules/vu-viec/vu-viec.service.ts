import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateVuViecDto } from './dto/create-vu-viec.dto';

@Injectable()
export class VuViecService {
  constructor(private readonly db: DatabaseService) {}

  findAll() {
    return this.db.query(
      `SELECT
         ma_ho_so,
         tieu_de,
         thoi_gian_vu_viec,
         dia_diem,
         trang_thai_hien_tai,
         thoi_gian_tao
       FROM ho_so_vu_viec
       ORDER BY thoi_gian_tao DESC`,
    );
  }

  async findOne(maHoSo: string) {
    const rows = await this.db.query(
      `SELECT hs.*, tk.ho_ten AS ten_can_bo_xu_ly
       FROM ho_so_vu_viec hs
       LEFT JOIN tai_khoan tk ON hs.ma_can_bo_xu_ly = tk.ma_tai_khoan
       WHERE hs.ma_ho_so = $1`,
      [maHoSo],
    );
    if (!rows.length) {
      throw new NotFoundException(`Không tìm thấy hồ sơ vụ việc ${maHoSo}`);
    }

    const [dienBien, tepDinhKem, doiTuong, phuongTien] = await Promise.all([
      this.db.query(
        `SELECT db.*, tk.ho_ten AS nguoi_ghi_nhan
         FROM dien_bien_xu_ly db
         JOIN tai_khoan tk ON db.ma_nguoi_ghi_nhan = tk.ma_tai_khoan
         WHERE db.ma_ho_so = $1
         ORDER BY db.thoi_diem_ghi_nhan DESC`,
        [maHoSo],
      ),
      this.db.query(
        `SELECT t.*
         FROM tep_dinh_kem t
         JOIN ho_so_tep_dinh_kem hst ON t.ma_tep = hst.ma_tep
         WHERE hst.ma_ho_so = $1 AND hst.da_go = FALSE
         ORDER BY hst.thoi_gian_gan DESC`,
        [maHoSo],
      ),
      this.db.query(
        `SELECT dt.*
         FROM doi_tuong_lien_quan dt
         JOIN ho_so_doi_tuong hsdt ON dt.ma_doi_tuong = hsdt.ma_doi_tuong
         WHERE hsdt.ma_ho_so = $1 AND hsdt.dang_su_dung = TRUE`,
        [maHoSo],
      ),
      this.db.query(
        `SELECT pt.*
         FROM phuong_tien_lien_quan pt
         JOIN ho_so_phuong_tien hspt ON pt.ma_phuong_tien = hspt.ma_phuong_tien
         WHERE hspt.ma_ho_so = $1 AND hspt.dang_su_dung = TRUE`,
        [maHoSo],
      ),
    ]);

    return {
      ...rows[0],
      dien_bien_xu_ly: dienBien,
      tep_dinh_kem: tepDinhKem,
      doi_tuong_lien_quan: doiTuong,
      phuong_tien_lien_quan: phuongTien,
    };
  }

  async create(dto: CreateVuViecDto & Record<string, any>) {
    const rows = await this.db.query(
      `INSERT INTO ho_so_vu_viec (
         tieu_de,
         thoi_gian_vu_viec,
         dia_diem,
         tom_tat_vu_viec
       )
       VALUES (
         $1,
         COALESCE($2::timestamptz, NOW()),
         COALESCE($3, 'Chưa xác định'),
         $4
       )
       RETURNING *`,
      [
        dto.tieu_de,
        dto.thoi_gian_vu_viec ?? dto.ngay_tiep_nhan ?? null,
        dto.dia_diem ?? null,
        dto.tom_tat_vu_viec ?? dto.mo_ta ?? null,
      ],
    );
    return rows[0];
  }
}