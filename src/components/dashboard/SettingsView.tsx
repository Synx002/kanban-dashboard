import React from 'react';
import {
    Card,
    Row,
    Col,
    Avatar,
    Button,
    Descriptions,
    Popconfirm,
    message,
    Alert,
    Typography,
    Tag,
} from 'antd';
import {
    UserOutlined,
    ReloadOutlined,
    CheckCircleFilled,
    DatabaseOutlined,
    SafetyCertificateOutlined,
} from '@ant-design/icons';

import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';

const { Title, Text } = Typography;

const cardStyle: React.CSSProperties = {
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    height: '100%',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
};

export const SettingsView: React.FC = () => {
    const { user } = useAuthStore();
    const { tasks, resetToDefaultTasks } = useTaskStore();

    const handleResetData = () => {
        resetToDefaultTasks();
        message.success('Data tugas berhasil direset ke data sampel awal!');
    };

    return (
        <div style={{ paddingBottom: 24 }}>
            {/* Page Header */}
            <div style={{ marginBottom: 28 }}>
                <Title
                    level={3}
                    style={{
                        margin: 0,
                        color: '#111827',
                        fontWeight: 700,
                    }}
                >
                    Settings
                </Title>
                <Text style={{ color: '#64748b', fontSize: 14 }}>
                    Kelola informasi akun dan pengaturan data aplikasi.
                </Text>
            </div>

            <Row gutter={[20, 20]}>
                {/* Profile Settings */}
                <Col xs={24} lg={12}>
                    <Card
                        style={cardStyle}
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 8,
                                    background: '#eff6ff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <UserOutlined style={{ color: '#2563eb', fontSize: 16 }} />
                                </div>
                                <span style={{ color: '#111827', fontWeight: 600 }}>
                                    Informasi Profil
                                </span>
                            </div>
                        }
                        extra={
                            <Tag
                                color="success"
                                icon={<CheckCircleFilled />}
                                style={{ borderRadius: 20, margin: 0 }}
                            >
                                Aktif
                            </Tag>
                        }
                        styles={{
                            header: {
                                borderBottom: '1px solid #f1f5f9',
                                minHeight: 64,
                            },
                            body: {
                                padding: 24,
                            },
                        }}
                    >
                        {/* User Information */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            padding: 16,
                            marginBottom: 24,
                            background: '#f8fafc',
                            borderRadius: 10,
                            border: '1px solid #f1f5f9',
                        }}>
                            <Avatar
                                size={56}
                                src={user?.image}
                                icon={<UserOutlined />}
                                style={{
                                    backgroundColor: '#1e40af',
                                    flexShrink: 0,
                                }}
                            />

                            <div style={{ minWidth: 0 }}>
                                <Text strong style={{
                                    display: 'block',
                                    fontSize: 16,
                                    color: '#111827',
                                }}>
                                    {user
                                        ? `${user.firstName} ${user.lastName}`
                                        : 'Emily Johnson'}
                                </Text>

                                <Text type="secondary" style={{ fontSize: 13 }}>
                                    @{user?.username || 'emilys'}
                                </Text>
                            </div>
                        </div>

                        {/* Account Details */}
                        <Text
                            strong
                            style={{
                                display: 'block',
                                marginBottom: 14,
                                color: '#475569',
                                fontSize: 13,
                            }}
                        >
                            DETAIL AKUN
                        </Text>

                        <Descriptions
                            column={1}
                            size="small"
                            styles={{
                                label: {
                                    color: '#64748b',
                                    width: 110,
                                },
                                content: {
                                    color: '#1e293b',
                                    fontWeight: 500,
                                },
                            }}
                        >
                            <Descriptions.Item label="Email">
                                {user?.email || 'emily.johnson@x.dummyjson.com'}
                            </Descriptions.Item>

                            <Descriptions.Item label="Role">
                                Product Manager
                            </Descriptions.Item>

                            <Descriptions.Item label="Gender">
                                {user?.gender
                                    ? user.gender.toUpperCase()
                                    : 'FEMALE'}
                            </Descriptions.Item>

                            <Descriptions.Item label="Status">
                                <span style={{ color: '#16a34a', fontWeight: 600 }}>
                                    <CheckCircleFilled style={{ marginRight: 6 }} />
                                    Active
                                </span>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                {/* Storage Management */}
                <Col xs={24} lg={12}>
                    <Card
                        style={cardStyle}
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 8,
                                    background: '#eff6ff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <DatabaseOutlined style={{ color: '#2563eb', fontSize: 16 }} />
                                </div>
                                <span style={{ color: '#111827', fontWeight: 600 }}>
                                    Manajemen Data
                                </span>
                            </div>
                        }
                        styles={{
                            header: {
                                borderBottom: '1px solid #f1f5f9',
                                minHeight: 64,
                            },
                            body: {
                                padding: 24,
                            },
                        }}
                    >
                        {/* Storage Information */}
                        <div style={{
                            padding: 18,
                            background: '#f8fafc',
                            borderRadius: 10,
                            border: '1px solid #e2e8f0',
                            marginBottom: 24,
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 16,
                            }}>
                                <Text strong style={{ color: '#334155' }}>
                                    Local Storage
                                </Text>
                                <Tag color="processing" style={{ margin: 0 }}>
                                    Browser
                                </Tag>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                            }}>
                                <div style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 10,
                                    background: '#dbeafe',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <DatabaseOutlined style={{
                                        fontSize: 20,
                                        color: '#2563eb',
                                    }} />
                                </div>

                                <div>
                                    <Title
                                        level={3}
                                        style={{
                                            margin: 0,
                                            color: '#111827',
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {tasks.length}
                                    </Title>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        Total tugas tersimpan
                                    </Text>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <Text strong style={{
                                display: 'block',
                                color: '#334155',
                                marginBottom: 8,
                            }}>
                                Reset Data Tugas
                            </Text>

                            <Text type="secondary" style={{
                                fontSize: 13,
                                lineHeight: 1.7,
                            }}>
                                Kembalikan seluruh tugas ke data sampel bawaan aplikasi.
                                Perubahan yang sudah dilakukan akan digantikan dengan
                                8 tugas awal.
                            </Text>
                        </div>

                        <Alert
                            type="warning"
                            showIcon
                            message="Perhatian"
                            description="Tindakan ini akan mengganti data tugas yang tersimpan saat ini."
                            style={{
                                borderRadius: 8,
                                marginBottom: 20,
                            }}
                        />

                        <Popconfirm
                            title="Reset Data Tugas?"
                            description="Apakah Anda yakin ingin mengembalikan data ke kondisi awal?"
                            okText="Ya, Reset"
                            cancelText="Batal"
                            okButtonProps={{ danger: true }}
                            onConfirm={handleResetData}
                        >
                            <Button
                                danger
                                icon={<ReloadOutlined />}
                                style={{
                                    borderRadius: 8,
                                    height: 38,
                                    fontWeight: 500,
                                }}
                            >
                                Reset Data Tugas
                            </Button>
                        </Popconfirm>
                    </Card>
                </Col>
            </Row>

            {/* Application Information */}
            <div style={{
                marginTop: 24,
                padding: '16px 20px',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
            }}>
                <SafetyCertificateOutlined style={{
                    fontSize: 20,
                    color: '#2563eb',
                }} />

                <div>
                    <Text strong style={{
                        display: 'block',
                        color: '#334155',
                        fontSize: 13,
                    }}>
                        TaskMaster Dashboard
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Authentication powered by DummyJSON · Data stored locally in your browser
                    </Text>
                </div>
            </div>
        </div>
    );
};