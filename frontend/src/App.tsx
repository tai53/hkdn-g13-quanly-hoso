import { Layout, Typography } from 'antd';
import HealthStatus from './components/HealthStatus';
import VuViecPage from './pages/VuViecPage';

const { Header, Content } = Layout;

export default function App() {
  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Typography.Title level={4} className="app-title">
          Hệ thống quản lý vụ việc và hồ sơ nghiệp vụ
        </Typography.Title>
        <HealthStatus />
      </Header>
      <Content className="app-content">
        <VuViecPage />
      </Content>
    </Layout>
  );
}
