
import api from './client';

import type {
  CreateVuViecInput,
  HealthResponse,
  VuViec,
  VuViecChiTiet,
  VuViecTomTat,
} from '../types/vu-viec';

/** Kiểm tra kết nối Backend và Database. */
export const getHealth = () =>
  api
    .get<HealthResponse>('/health', {
      validateStatus: (status) =>
        status === 200 || status === 503,
    })
    .then((response) => response.data);

/** Lấy danh sách vụ việc. */
export const getVuViecList = () =>
  api
    .get<VuViecTomTat[]>('/vu-viec')
    .then((response) => response.data);

/** Lấy chi tiết vụ việc theo UUID hoặc mã hồ sơ. */
export const getVuViec = (id: string) =>
  api
    .get<VuViecChiTiet>(
      `/vu-viec/${encodeURIComponent(id)}`,
    )
    .then((response) => response.data);

/** Tạo vụ việc mới. */
export const createVuViec = (
  data: CreateVuViecInput,
) =>
  api
    .post<VuViec>('/vu-viec', data)
    .then((response) => response.data);
