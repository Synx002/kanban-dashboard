import React from 'react';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import {
    UnorderedListOutlined,
    ClockCircleOutlined,
    HourglassOutlined,
    CheckCircleOutlined,
    FireOutlined,
} from '@ant-design/icons';
import { useTaskStore } from '../../store/taskStore';

export const DashboardStats: React.FC = () => {
    const { tasks } = useTaskStore();

    const totalTasks = tasks.length;
    const backlogTasks = tasks.filter((t) => t.status === 'backlog').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const highPriorityTasks = tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div style={{ marginBottom: 20 }}>
            <Row gutter={[12, 12]}>
                {/* 1. Total Tasks */}
                <Col xs={12} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        hoverable
                        className="compact-stat-card"
                        style={{
                            borderRadius: 10,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            borderLeft: '4px solid #1890ff',
                            height: '100%',
                        }}
                        styles={{ body: { padding: '14px 16px' } }}
                    >
                        <Statistic
                            title={<span style={{ color: '#64748b', fontSize: 12, fontWeight: 500 }}>Total Tasks</span>}
                            value={totalTasks}
                            prefix={<UnorderedListOutlined style={{ color: '#1890ff', marginRight: 4, fontSize: 16 }} />}
                            valueStyle={{ color: '#1e293b', fontWeight: 700, fontSize: 22 }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Progress
                                percent={completionRate}
                                size="small"
                                status={completionRate === 100 ? 'success' : 'active'}
                                strokeColor="#1890ff"
                            />
                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                                {completionRate}% selesai
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* 2. Backlog Tasks */}
                <Col xs={12} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        hoverable
                        className="compact-stat-card"
                        style={{
                            borderRadius: 10,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            borderLeft: '4px solid #f59e0b',
                            height: '100%',
                        }}
                        styles={{ body: { padding: '14px 16px' } }}
                    >
                        <Statistic
                            title={<span style={{ color: '#64748b', fontSize: 12, fontWeight: 500 }}>Backlog</span>}
                            value={backlogTasks}
                            prefix={<ClockCircleOutlined style={{ color: '#f59e0b', marginRight: 4, fontSize: 16 }} />}
                            valueStyle={{ color: '#f59e0b', fontWeight: 700, fontSize: 22 }}
                        />
                        <div style={{ marginTop: 8, fontSize: 11, color: '#94a3b8', lineHeight: 1.3 }}>
                            Belum dikerjakan
                        </div>
                    </Card>
                </Col>

                {/* 3. In Progress Tasks */}
                <Col xs={12} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        hoverable
                        className="compact-stat-card"
                        style={{
                            borderRadius: 10,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            borderLeft: '4px solid #8b5cf6',
                            height: '100%',
                        }}
                        styles={{ body: { padding: '14px 16px' } }}
                    >
                        <Statistic
                            title={<span style={{ color: '#64748b', fontSize: 12, fontWeight: 500 }}>In Progress</span>}
                            value={inProgressTasks}
                            prefix={<HourglassOutlined style={{ color: '#8b5cf6', marginRight: 4, fontSize: 16 }} />}
                            valueStyle={{ color: '#8b5cf6', fontWeight: 700, fontSize: 22 }}
                        />
                        <div style={{ marginTop: 8, fontSize: 11, color: '#94a3b8', lineHeight: 1.3 }}>
                            Aktif dikerjakan
                        </div>
                    </Card>
                </Col>

                {/* 4. Completed Tasks */}
                <Col xs={12} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        hoverable
                        className="compact-stat-card"
                        style={{
                            borderRadius: 10,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            borderLeft: '4px solid #10b981',
                            height: '100%',
                        }}
                        styles={{ body: { padding: '14px 16px' } }}
                    >
                        <Statistic
                            title={<span style={{ color: '#64748b', fontSize: 12, fontWeight: 500 }}>Completed</span>}
                            value={completedTasks}
                            prefix={<CheckCircleOutlined style={{ color: '#10b981', marginRight: 4, fontSize: 16 }} />}
                            valueStyle={{ color: '#10b981', fontWeight: 700, fontSize: 22 }}
                        />
                        <div style={{ marginTop: 8, fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4, lineHeight: 1.3 }}>
                            {highPriorityTasks > 0 ? (
                                <span style={{ color: '#ff4d4f' }}>
                                    <FireOutlined /> {highPriorityTasks} prioritas tinggi
                                </span>
                            ) : (
                                <span style={{ color: '#10b981' }}>Semua beres</span>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
