import React from 'react';
import { Card, Row, Col, Avatar, Button, Descriptions, Popconfirm, message, Alert, Typography } from 'antd';
import {
    UserOutlined,
    ReloadOutlined,
    CheckCircleOutlined,
    DatabaseOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';

const { Title, Text } = Typography;

export const SettingsView: React.FC = () => {
    const { user } = useAuthStore();
    const { tasks, resetToDefaultTasks } = useTaskStore();

    const handleResetData = () => {
        resetToDefaultTasks();
        message.success('Data tugas berhasil direset ke data sampel awal!');
    };

    return (
        <div>
            <Row gutter={[20, 20]}>
                {/* Profile Card */}
                <Col xs={24} md={12}>
                    <Card
                        title="Informasi Profil"
                        style={{ borderRadius: 10, height: '100%' }}
                        extra={<span style={{ color: '#52c41a' }}><CheckCircleOutlined /> Terverifikasi</span>}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                            <Avatar
                                size={64}
                                src={user?.image}
                                icon={<UserOutlined />}
                                style={{ backgroundColor: '#1890ff' }}
                            />
                            <div>
                                <h3 style={{ margin: 0, fontSize: 18 }}>
                                    {user ? `${user.firstName} ${user.lastName}` : 'Emily Johnson'}
                                </h3>
                                <Text type="secondary">@{user?.username || 'emilys'}</Text>
                            </div>
                        </div>

                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="Email">
                                {user?.email || 'emily.johnson@x.dummyjson.com'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Role">
                                Product Manager
                            </Descriptions.Item>
                            <Descriptions.Item label="Gender">
                                {user?.gender ? user.gender.toUpperCase() : 'FEMALE'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status Akun">
                                <span style={{ color: '#52c41a', fontWeight: 600 }}>Aktif (DummyJSON Auth)</span>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                {/* Data & Storage Management */}
                <Col xs={24} md={12}>
                    <Card
                        title="Manajemen Penyimpanan & Data"
                        style={{ borderRadius: 10, height: '100%' }}
                    >
                        <Alert
                            type="info"
                            showIcon
                            icon={<DatabaseOutlined />}
                            message="Penyimpanan Lokal (LocalStorage)"
                            description={`Semua data tugas disimpan secara persisten di LocalStorage browser Anda. Saat ini tersimpan ${tasks.length} tugas.`}
                            style={{ marginBottom: 20 }}
                        />

                        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>
                            Jika Anda ingin mengembalikan daftar tugas ke contoh bawaan awal (default sample tasks) yang mencakup 8 tugas di 4 kolom Kanban, gunakan tombol di bawah ini:
                        </p>

                        <Popconfirm
                            title="Reset Data Tugas"
                            description="Apakah Anda yakin ingin mengembalikan data ke contoh awal? Perubahan yang Anda buat akan diganti."
                            okText="Ya, Reset"
                            cancelText="Batal"
                            onConfirm={handleResetData}
                        >
                            <Button icon={<ReloadOutlined />} type="default" danger>
                                Reset Tugas ke Data Sampel Awal
                            </Button>
                        </Popconfirm>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

