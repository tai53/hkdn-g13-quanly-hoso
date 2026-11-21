import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateVuViecDto } from './dto/create-vu-viec.dto';
import { HoSo, VuViec, VuViecChiTiet, VuViecTomTat } from './vu-viec.types';

// Service: chứa nghiệp vụ và truy vấn database. Controller chỉ nhận request rồi gọi sang đây.
@Injectable()
export class VuViecService {
  constructor(private readonly db: DatabaseService) {}

  findAll(): Promise<VuViecTomTat[]> {
    return this.db.query<VuViecTomTat>(
      `SELECT id, ma_vu_viec, tieu_de, trang_thai, ngay_tiep_nhan, created_at
       FROM vu_viec ORDER BY created_at DESC`,
    );
  }

  async findOne(id: number): Promise<VuViecChiTiet> {
    const rows = await this.db.query<VuViec>('SELECT * FROM vu_viec WHERE id = $1', [id]);
    if (!rows.length) throw new NotFoundException('Không tìm thấy vụ việc');

    const hoSo = await this.db.query<HoSo>(
      'SELECT * FROM ho_so WHERE vu_viec_id = $1 ORDER BY created_at DESC',
      [id],
    );
    return { ...rows[0], ho_so: hoSo };
  }

  async create(dto: CreateVuViecDto): Promise<VuViec> {
    const rows = await this.db.query<VuViec>(
      `INSERT INTO vu_viec (ma_vu_viec, tieu_de, mo_ta, ngay_tiep_nhan)
       VALUES ($1, $2, $3, COALESCE($4::date, CURRENT_DATE)) RETURNING *`,
      [dto.ma_vu_viec, dto.tieu_de, dto.mo_ta ?? null, dto.ngay_tiep_nhan ?? null],
    );
    return rows[0];
  }
}
