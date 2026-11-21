import { useEffect, useState } from 'react';
import { Tag } from 'antd';
import { getHealth } from '../api/vuViec.api';

type State = { color: string; text: string };

export default function HealthStatus() {
  const [state, setState] = useState<State>({ color: 'default', text: 'Đang kiểm tra...' });

  useEffect(() => {
    getHealth()
      .then((d) =>
        setState({
          color: d.database === 'connected' ? 'success' : 'error',
          text: `API: ${d.status} · DB: ${d.database}`,
        }),
      )
      .catch(() => setState({ color: 'error', text: 'Không kết nối được API' }));
  }, []);

  return <Tag color={state.color}>{state.text}</Tag>;
}
