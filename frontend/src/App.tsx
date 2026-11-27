
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import {
  Alert,
  Button,
  Layout,
  Space,
  Typography,
} from 'antd';

import { logout } from './api/auth.api';
import { getErrorMessage } from './api/client';

import {
  getSession,
  getAccessToken,
  subscribeSession,
} from './auth/session';

import HealthStatus from './components/HealthStatus';
import LoginPage from './pages/LoginPage';
import VuViecPage from './pages/VuViecPage';

const { Header, Content } = Layout;

export default function App() {
  const session = useSyncExternalStore(
    subscribeSession,
    getSession,
  );

  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState('');
  const logoutPending = useRef(false);

  useEffect(() => {
    if (!session) {
      return;
    }

    const delay = Math.max(
      0,
      session.expiresAt - Date.now(),
    );

    const timer = window.setTimeout(() => {
      getAccessToken();
    }, delay);

    return () => window.clearTimeout(timer);
  }, [session]);

  async function handleLogout() {
    if (logoutPending.current) {
      return;
    }

    logoutPending.current = true;
    setLoggingOut(true);
    setError('');

    try {
      await logout();
    } catch (err: unknown) {
      if (getSession() === session) {
        setError(getErrorMessage(err));
      }
    } finally {
      logoutPending.current = false;
      setLoggingOut(false);
    }
  }

  return (
    <Layout className="app-layout">
      <Header
        className="app-header"
        style={{
          height: 'auto',
          minHeight: 64,
          flexWrap: 'wrap',
          gap: 8,
          lineHeight: 'normal',
        }}
      >
        <Typography.Title
          level={4}
          className="app-title"
        >
          Hệ thống quản lý vụ việc và hồ sơ nghiệp vụ
        </Typography.Title>

        <Space wrap>
          <HealthStatus />

          {session && (
            <>
              <Typography.Text
              >
                {session.user.full_name}
                {' — '}
                {session.user.role.name}
              </Typography.Text>

              <Button
                loading={loggingOut}
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </>
          )}
        </Space>
      </Header>

      <Content className="app-content">
        {session ? (
          <>
            {error && (
              <Alert
                type="error"
                message={error}
                showIcon
                closable
                onClose={() => setError('')}
                style={{ marginBottom: 16 }}
              />
            )}

            <VuViecPage
              key={session.accessToken}
            />
          </>
        ) : (
          <LoginPage />
        )}
      </Content>
    </Layout>
  );
}
