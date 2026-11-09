import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuthStore } from '../store/authStore';
import { getErrorMessage } from '../api/axiosClient';

const { Title, Text } = Typography;

interface LoginValues {
    username: string;
    password: string;
}

export default function Login() {
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm<LoginValues>();
    const navigate = useNavigate();
    const location = useLocation();

    const { login, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const onFinish = async (values: LoginValues) => {
        setLoading(true);
        try {
            await login(values.username, values.password);
            message.success('Login berhasil! Selamat datang.');

            const destination = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';
            navigate(destination, { replace: true });
        } catch (error: unknown) {
            message.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '16px 12px',
            }}
        >
            <Card
                style={{
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 14,
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                }}
                styles={{
                    body: { padding: '24px 20px' },
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={3} style={{ marginBottom: 4 }}>
                        Task Management
                    </Title>
                    <Text type="secondary">Silakan masuk ke akun Anda</Text>
                </div>



                <Form
                    form={form}
                    name="loginForm"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Silakan masukkan username!' }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="username"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Silakan masukkan password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                            placeholder="password"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 24, marginBottom: 8 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<LoginOutlined />}
                            loading={loading}
                            size="large"
                            block
                        >
                            Masuk
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
