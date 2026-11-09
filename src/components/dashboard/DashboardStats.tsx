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
        <div style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
                {/* 1. Total Tasks */}
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        hoverable
                        style={{
                            borderRadius: 10,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            borderLeft: '4px solid #1890ff',
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>Total Tasks</span>}
                            value={totalTasks}
                            prefix={<UnorderedListOutlined style={{ color: '#1890ff', marginRight: 6 }} />}
                            valueStyle={{ color: '#1e293b', fontWeight: 700 }}
                        />
                        <div style={{ marginTop: 10 }}>
                            <Progress
                                percent={completionRate}
                                size="small"
                                status={completionRate === 100 ? 'success' : 'active'}
                                strokeColor="#1890ff"
                            />
                            <span style={{ fontSize: 11, color: '#94a3b8' }}>
                                {completionRate}% tugas telah selesai
                            </span>
                        </div>
                    </Card>
                </Col>

                {/* 2. Backlog Tasks */}
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        hoverable
                        style={{
                            borderRadius: 10,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            borderLeft: '4px solid #f59e0b',
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>Backlog Tasks</span>}
                            value={backlogTasks}
                            prefix={<ClockCircleOutlined style={{ color: '#f59e0b', marginRight: 6 }} />}
                            valueStyle={{ color: '#f59e0b', fontWeight: 700 }}
                        />
                        <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
                            Tugas yang belum dikerjakan
                        </div>
                    </Card>
                </Col>

                {/* 3. In Progress Tasks */}
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        hoverable
                        style={{
                            borderRadius: 10,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            borderLeft: '4px solid #8b5cf6',
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>In Progress Tasks</span>}
                            value={inProgressTasks}
                            prefix={<HourglassOutlined style={{ color: '#8b5cf6', marginRight: 6 }} />}
                            valueStyle={{ color: '#8b5cf6', fontWeight: 700 }}
                        />
                        <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8' }}>
                            Sedang aktif dikerjakan
                        </div>
                    </Card>
                </Col>

                {/* 4. Completed Tasks */}
                <Col xs={24} sm={12} lg={6}>
                    <Card
                        bordered={false}
                        hoverable
                        style={{
                            borderRadius: 10,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            borderLeft: '4px solid #10b981',
                        }}
                    >
                        <Statistic
                            title={<span style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>Completed Tasks</span>}
                            value={completedTasks}
                            prefix={<CheckCircleOutlined style={{ color: '#10b981', marginRight: 6 }} />}
                            valueStyle={{ color: '#10b981', fontWeight: 700 }}
                        />
                        <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                            {highPriorityTasks > 0 ? (
                                <span style={{ color: '#ff4d4f' }}>
                                    <FireOutlined /> {highPriorityTasks} prioritas tinggi tersisa
                                </span>
                            ) : (
                                <span style={{ color: '#10b981' }}>Semua prioritas tinggi beres</span>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

