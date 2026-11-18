import { useEffect, useState } from 'react';
import { getHealth } from '../api/vuViec.api';

export default function HealthStatus() {
  const [status, setStatus] = useState('Đang kiểm tra...');

  useEffect(() => {
    getHealth()
      .then((d) => setStatus(`API: ${d.status} · DB: ${d.database}`))
      .catch(() => setStatus('Không kết nối được API'));
  }, []);

  return <p className="status">{status}</p>;
}
