import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined, ArrowRightOutlined, CheckCircleFilled } from '@ant-design/icons';
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
                background: 'radial-gradient(circle at 50% 10%, #1e293b 0%, #0f172a 100%)',
                padding: '24px 16px',
            }}
        >
            <Card
                bordered={false}
                style={{
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: 20,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                    background: '#ffffff',
                    overflow: 'hidden',
                }}
                styles={{
                    body: { padding: '36px 32px' },
                }}
            >
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: '14px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 16px',
                            color: '#0f172a',
                            fontSize: 22,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                        }}
                    >
                        <CheckCircleFilled style={{ color: '#6366f1' }} />
                    </div>
                    <Title level={3} style={{ marginBottom: 6, fontWeight: 700, color: '#0f172a' }}>
                        Taskify Dashboard
                    </Title>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                        Masuk untuk mengelola produktivitas tim Anda
                    </Text>
                </div>

                {/* Form Section */}
                <Form
                    form={form}
                    name="loginForm"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    requiredMark={false}
                >
                    <Form.Item
                        label={<span style={{ fontWeight: 600, color: '#334155' }}>Username</span>}
                        name="username"
                        rules={[{ required: true, message: 'Masukkan username Anda!' }]}
                        style={{ marginBottom: 18 }}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#94a3b8', marginRight: 6 }} />}
                            placeholder="username"
                            size="large"
                            style={{ borderRadius: 10, backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ fontWeight: 600, color: '#334155' }}>Password</span>}
                        name="password"
                        rules={[{ required: true, message: 'Masukkan password Anda!' }]}
                        style={{ marginBottom: 24 }}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#94a3b8', marginRight: 6 }} />}
                            placeholder="password"
                            size="large"
                            style={{ borderRadius: 10, backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<ArrowRightOutlined />}
                            iconPosition="end"
                            loading={loading}
                            size="large"
                            block
                            style={{
                                borderRadius: 10,
                                height: 46,
                                fontWeight: 600,
                                background: '#0f172a',
                                borderColor: '#0f172a',
                                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
                            }}
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>

                {/* Footer Minimalist Note */}
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Text type="secondary" style={{ fontSize: 12, color: '#94a3b8' }}>
                        DummyJSON Authentication API Integration
                    </Text>
                </div>
            </Card>
        </div>
    );
}