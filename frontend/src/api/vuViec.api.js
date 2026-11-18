import api from './client';

export const getHealth = () => api.get('/health').then((r) => r.data);
export const getVuViecList = () => api.get('/vu-viec').then((r) => r.data);
export const getVuViec = (id) => api.get(`/vu-viec/${id}`).then((r) => r.data);
export const createVuViec = (data) => api.post('/vu-viec', data).then((r) => r.data);
