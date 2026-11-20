import HealthStatus from './components/HealthStatus';
import VuViecPage from './pages/VuViecPage';

export default function App() {
  return (
    <div className="container">
      <header>
        <h1>Hệ thống quản lý vụ việc và hồ sơ nghiệp vụ</h1>
        <HealthStatus />
      </header>
      <main>
        <VuViecPage />
      </main>
    </div>
  );
}
