import { useEffect, useState } from 'react';
import { Alert, Card, Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import { getErrorMessage } from '../api/client';
import { getVuViecList } from '../api/vuViec.api';
import type { TrangThaiVuViec, VuViecTomTat } from '../types/vu-viec';

const TRANG_THAI: Record<TrangThaiVuViec, { label: string; color: string }> = {
  moi: { label: 'Mới', color: 'blue' },
  dang_xu_ly: { label: 'Đang xử lý', color: 'gold' },
  hoan_thanh: { label: 'Hoàn thành', color: 'green' },
  huy: { label: 'Hủy', color: 'default' },
};

const columns: TableColumnsType<VuViecTomTat> = [
  { title: 'Mã', dataIndex: 'ma_vu_viec', width: 140 },
  { title: 'Tiêu đề', dataIndex: 'tieu_de' },
  {
    title: 'Trạng thái',
    dataIndex: 'trang_thai',
    width: 140,
    render: (v: TrangThaiVuViec) => <Tag color={TRANG_THAI[v].color}>{TRANG_THAI[v].label}</Tag>,
  },
  {
    title: 'Ngày tiếp nhận',
    dataIndex: 'ngay_tiep_nhan',
    width: 150,
    render: (v: string) => dayjs(v).format('DD/MM/YYYY'),
  },
];

export default function VuViecPage() {
  const [items, setItems] = useState<VuViecTomTat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getVuViecList()
      .then(setItems)
      .catch((e: unknown) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card title="Danh sách vụ việc">
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
      <Table<VuViecTomTat> rowKey="id" columns={columns} dataSource={items} loading={loading} pagination={false} />
    </Card>
  );
}
