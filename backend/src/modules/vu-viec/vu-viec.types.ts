export type CaseStatus = 'RECEIVED' | 'IN_PROGRESS' | 'COMPLETED';

export interface CaseRecord {
  id: string; // UUID
  code: string; // VD: HS-2026-0001
  title: string;
  occurred_at: Date | null;
  location: string | null;
  summary: string | null;
  status: CaseStatus;
  assignee_id: string | null;
  created_at: Date;
  updated_at: Date;
}

export type CaseSummary = Pick<
  CaseRecord,
  'id' | 'code' | 'title' | 'occurred_at' | 'location' | 'status' | 'assignee_id' | 'created_at'
>;

export interface CaseActivity {
  id: string;
  case_id: string;
  actor_id: string;
  actor_name?: string;
  content: string | null;
  old_status: CaseStatus | null;
  new_status: CaseStatus | null;
  created_at: Date;
}

export interface Attachment {
  id: string;
  case_id: string;
  file_name: string;
  file_type: 'DOCUMENT' | 'IMAGE' | 'VIDEO';
  mime_type: string;
  size: number;
  storage_key: string;
  description: string | null;
  uploaded_by: string;
  created_at: Date;
  is_removed: boolean;
  removed_by: string | null;
  removed_at: Date | null;
}

export interface Subject {
  id: string;
  full_name: string;
  identification_info: string | null;
  extra_info: string | null;
  is_active: boolean;
  role_in_case?: string | null;
  note?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Vehicle {
  id: string;
  plate_number: string | null;
  vehicle_type: string | null;
  identification_features: string | null;
  extra_info: string | null;
  is_active: boolean;
  note?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CaseDetail extends CaseRecord {
  assignee_name?: string | null;
  activities: CaseActivity[];
  attachments: Attachment[];
  subjects: Subject[];
  vehicles: Vehicle[];
}

// Alias giữ tương thích với các file cũ đang import
export type VuViec = CaseRecord;
export type VuViecTomTat = CaseSummary;
export type VuViecChiTiet = CaseDetail;