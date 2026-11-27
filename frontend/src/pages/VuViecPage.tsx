
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Alert,
  Button,
  Card,
  Table,
  Tag,
} from 'antd';

import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';

import { getErrorMessage } from '../api/client';
import { getVuViecList } from '../api/vuViec.api';

import type {
  CaseStatus,
  VuViecTomTat,
} from '../types/vu-viec';

const TRANG_THAI: Record<
  CaseStatus,
  { label: string; color: string }
> = {
  RECEIVED: {
    label: 'Tiếp nhận',
    color: 'blue',
  },
  IN_PROGRESS: {
    label: 'Đang xử lý',
    color: 'gold',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    color: 'green',
  },
};

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return 'Chưa xác định';
  }

  const date = dayjs(value);

  return date.isValid()
    ? date.format('DD/MM/YYYY HH:mm')
    : 'Không hợp lệ';
}

const columns: TableColumnsType<VuViecTomTat> = [
  {
    title: 'Mã hồ sơ',
    dataIndex: 'code',
    width: 160,
  },
  {
    title: 'Tiêu đề',
    dataIndex: 'title',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    width: 150,
    render: (value: CaseStatus) => {
      const status = TRANG_THAI[value];

      return (
        <Tag color={status?.color ?? 'default'}>
          {status?.label ?? 'Không xác định'}
        </Tag>
      );
    },
  },
  {
    title: 'Địa điểm',
    dataIndex: 'location',
    render: (value: string | null) =>
      value || 'Chưa xác định',
  },
  {
    title: 'Thời điểm xảy ra',
    dataIndex: 'occurred_at',
    width: 180,
    render: formatDate,
  },
  {
    title: 'Ngày tạo hồ sơ',
    dataIndex: 'created_at',
    width: 180,
    render: formatDate,
  },
];

export default function VuViecPage() {
  const [items, setItems] =
    useState<VuViecTomTat[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const requestId = useRef(0);

  async function loadCases() {
    const currentId = ++requestId.current;

    setLoading(true);
    setError('');

    try {
      const data = await getVuViecList();

      if (requestId.current !== currentId) {
        return;
      }

      if (!Array.isArray(data)) {
        throw new Error(
          'Dữ liệu danh sách vụ việc không hợp lệ',
        );
      }

      setItems(data);
    } catch (err: unknown) {
      if (requestId.current === currentId) {
        setItems([]);
        setError(getErrorMessage(err));
      }
    } finally {
      if (requestId.current === currentId) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    void loadCases();

    return () => {
      requestId.current += 1;
    };
  }, []);

  return (
    <Card
      title="Danh sách vụ việc"
      extra={
        <Button
          onClick={() => void loadCases()}
          loading={loading}
        >
          Làm mới
        </Button>
      }
    >
      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Table<VuViecTomTat>
        rowKey="id"
        columns={columns}
        dataSource={items}
        loading={loading}
        pagination={false}
        scroll={{ x: 1000 }}
        locale={{
          emptyText: error
            ? 'Không thể tải dữ liệu'
            : 'Chưa có vụ việc',
        }}
      />
    </Card>
  );
}
