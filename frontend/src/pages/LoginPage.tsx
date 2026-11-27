
import { useRef, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Typography,
} from 'antd';

import { login } from '../api/auth.api';
import { getErrorMessage } from '../api/client';
import type { LoginInput } from '../types/auth';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);

  async function handleLogin(values: LoginInput) {
    if (submitting.current) {
      return;
    }

    submitting.current = true;
    setLoading(true);
    setError('');

    try {
      await login(values);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '48px 16px',
      }}
    >
      <Card style={{ width: '100%', maxWidth: 420 }}>
        <Typography.Title level={3}>
          Đăng nhập
        </Typography.Title>

        <Typography.Paragraph type="secondary">
          Hệ thống quản lý vụ việc và hồ sơ nghiệp vụ
        </Typography.Paragraph>

        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form<LoginInput>
          layout="vertical"
          onFinish={handleLogin}
          disabled={loading}
        >
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên đăng nhập',
              },
              {
                max: 50,
                message: 'Tối đa 50 ký tự',
              },
            ]}
          >
            <Input
              autoComplete="username"
              placeholder="Nhập tên đăng nhập"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu',
              },
              {
                max: 128,
                message: 'Tối đa 128 ký tự',
              },
            ]}
          >
            <Input.Password
              autoComplete="current-password"
              placeholder="Nhập mật khẩu"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
          >
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </div>
  );
}
