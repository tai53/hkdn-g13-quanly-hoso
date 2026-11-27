
export type CaseStatus =
  | 'RECEIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED';

export interface CaseRecord {
  id: string;
  code: string;
  title: string;
  occurred_at: string | null;
  location: string | null;
  summary: string | null;
  status: CaseStatus;
  assignee_id: string | null;
  created_at: string;
  updated_at: string;
}

export type CaseSummary = Pick<
  CaseRecord,
  | 'id'
  | 'code'
  | 'title'
  | 'occurred_at'
  | 'location'
  | 'status'
  | 'assignee_id'
  | 'created_at'
>;

export interface CaseActivity {
  id: string;
  case_id: string;
  actor_id: string;
  actor_name?: string | null;
  content: string | null;
  old_status: CaseStatus | null;
  new_status: CaseStatus | null;
  created_at: string;
}

export interface Attachment {
  id: string;
  case_id: string;
  file_name: string;
  file_type: 'DOCUMENT' | 'IMAGE' | 'VIDEO';
  mime_type: string;
  size: number | string;
  storage_key: string;
  description: string | null;
  uploaded_by: string;
  created_at: string;
  is_removed: boolean;
  removed_by: string | null;
  removed_at: string | null;
}

export interface Subject {
  id: string;
  full_name: string;
  identification_info: string | null;
  extra_info: string | null;
  is_active: boolean;
  role_in_case?: string | null;
  note?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  plate_number: string | null;
  vehicle_type: string | null;
  identification_features: string | null;
  extra_info: string | null;
  is_active: boolean;
  note?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaseDetail extends CaseRecord {
  assignee_name?: string | null;
  activities: CaseActivity[];
  attachments: Attachment[];
  subjects: Subject[];
  vehicles: Vehicle[];
}

export interface CreateVuViecInput {
  title: string;
  occurred_at?: string;
  location?: string;
  summary?: string;
  assignee_id?: string;
}

export interface HealthResponse {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  dbTime?: string;
  message?: string;
}

// Alias để tương thích với tên import hiện tại.
export type TrangThaiVuViec = CaseStatus;
export type VuViec = CaseRecord;
export type VuViecTomTat = CaseSummary;
export type VuViecChiTiet = CaseDetail;
