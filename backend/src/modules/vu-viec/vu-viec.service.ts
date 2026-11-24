import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateVuViecDto } from './dto/create-vu-viec.dto';
import {
  Attachment,
  CaseActivity,
  CaseDetail,
  CaseRecord,
  CaseSummary,
  Subject,
  Vehicle,
} from './vu-viec.types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable()
export class VuViecService {
  constructor(private readonly db: DatabaseService) {}

  findAll(): Promise<CaseSummary[]> {
    return this.db.query<CaseSummary>(
      `SELECT
         id,
         code,
         title,
         occurred_at,
         location,
         status,
         assignee_id,
         created_at
       FROM cases
       ORDER BY created_at DESC`,
    );
  }

  async findOne(idOrCode: string): Promise<CaseDetail> {
    const isUuid = UUID_REGEX.test(idOrCode);
    const rows = await this.db.query<CaseRecord & { assignee_name: string | null }>(
      `SELECT c.*, u.full_name AS assignee_name
       FROM cases c
       LEFT JOIN users u ON c.assignee_id = u.id
       WHERE ${isUuid ? 'c.id = $1::uuid' : 'c.code = $1'}`,
      [idOrCode],
    );

    if (!rows.length) {
      throw new NotFoundException(`Không tìm thấy hồ sơ vụ việc: ${idOrCode}`);
    }

    const caseItem = rows[0];

    const [activities, attachments, subjects, vehicles] = await Promise.all([
      this.db.query<CaseActivity>(
        `SELECT ca.*, u.full_name AS actor_name
         FROM case_activities ca
         JOIN users u ON ca.actor_id = u.id
         WHERE ca.case_id = $1
         ORDER BY ca.created_at DESC`,
        [caseItem.id],
      ),
      this.db.query<Attachment>(
        `SELECT *
         FROM attachments
         WHERE case_id = $1 AND is_removed = FALSE
         ORDER BY created_at DESC`,
        [caseItem.id],
      ),
      this.db.query<Subject>(
        `SELECT s.*, cs.role_in_case, cs.note
         FROM subjects s
         JOIN case_subjects cs ON s.id = cs.subject_id
         WHERE cs.case_id = $1
         ORDER BY cs.created_at DESC`,
        [caseItem.id],
      ),
      this.db.query<Vehicle>(
        `SELECT v.*, cv.note
         FROM vehicles v
         JOIN case_vehicles cv ON v.id = cv.vehicle_id
         WHERE cv.case_id = $1
         ORDER BY cv.created_at DESC`,
        [caseItem.id],
      ),
    ]);

    return {
      ...caseItem,
      activities,
      attachments,
      subjects,
      vehicles,
    };
  }

  async create(dto: CreateVuViecDto): Promise<CaseRecord> {
    const title = (dto.title ?? dto.tieu_de ?? '').trim();
    if (!title) {
      throw new BadRequestException('Tiêu đề hồ sơ (title) là bắt buộc');
    }

    const rows = await this.db.query<CaseRecord>(
      `INSERT INTO cases (title, occurred_at, location, summary, assignee_id)
       VALUES ($1, $2::timestamptz, $3, $4, $5::uuid)
       RETURNING *`,
      [
        title,
        dto.occurred_at ?? dto.ngay_tiep_nhan ?? null,
        dto.location ?? null,
        dto.summary ?? dto.mo_ta ?? null,
        dto.assignee_id ?? null,
      ],
    );
    return rows[0];
  }
}