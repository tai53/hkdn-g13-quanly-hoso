import api from './client';
import type { CreateVuViecInput, HealthResponse, VuViec, VuViecChiTiet, VuViecTomTat } from '../types/vu-viec';

// 503 nghĩa là API vẫn chạy nhưng mất kết nối DB, nên vẫn đọc nội dung thay vì coi là lỗi.
export const getHealth = () =>
  api
    .get<HealthResponse>('/health', { validateStatus: (s) => s === 200 || s === 503 })
    .then((r) => r.data);
export const getVuViecList = () => api.get<VuViecTomTat[]>('/vu-viec').then((r) => r.data);
export const getVuViec = (id: number) => api.get<VuViecChiTiet>(`/vu-viec/${id}`).then((r) => r.data);
export const createVuViec = (data: CreateVuViecInput) => api.post<VuViec>('/vu-viec', data).then((r) => r.data);
