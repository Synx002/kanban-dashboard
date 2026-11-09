
import React from 'react';
import { Row, Col, Card, Statistic, Progress, Typography } from 'antd';
import {
    UnorderedListOutlined,
    ClockCircleOutlined,
    HourglassOutlined,
    CheckCircleOutlined,
    FireOutlined,
} from '@ant-design/icons';
import { useTaskStore } from '../../store/taskStore';

const { Text } = Typography;

export const DashboardStats: React.FC = () => {
    const { tasks } = useTaskStore();

    const totalTasks = tasks.length;
    const backlogTasks = tasks.filter((t) => t.status === 'backlog').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;

    const highPriorityTasks = tasks.filter(
        (t) => t.priority === 'high' && t.status !== 'done'
    ).length;

    const completionRate =
        totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

    const stats = [
        {
            title: 'Total Tasks',
            value: totalTasks,
            description: 'Jumlah seluruh tugas',
            icon: <UnorderedListOutlined />,
            color: '#3b82f6',
            background: '#eff6ff',
        },
        {
            title: 'Backlog Tasks',
            value: backlogTasks,
            description: 'Belum mulai dikerjakan',
            icon: <ClockCircleOutlined />,
            color: '#d97706',
            background: '#fffbeb',
        },
        {
            title: 'In Progress',
            value: inProgressTasks,
            description: 'Sedang aktif dikerjakan',
            icon: <HourglassOutlined />,
            color: '#8b5cf6',
            background: '#f5f3ff',
        },
        {
            title: 'Completed Tasks',
            value: completedTasks,
            description: 'Tugas berhasil diselesaikan',
            icon: <CheckCircleOutlined />,
            color: '#16a34a',
            background: '#f0fdf4',
        },
    ];

    return (
        <div style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
                {stats.map((stat) => (
                    <Col xs={24} sm={12} lg={6} key={stat.title}>
                        <Card
                            hoverable
                            bordered={false}
                            style={{
                                borderRadius: 12,
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                                height: '100%',
                            }}
                            styles={{
                                body: {
                                    padding: 20,
                                },
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 16,
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#64748b',
                                        fontSize: 13,
                                        fontWeight: 500,
                                    }}
                                >
                                    {stat.title}
                                </Text>

                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 10,
                                        background: stat.background,
                                        color: stat.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 16,
                                    }}
                                >
                                    {stat.icon}
                                </div>
                            </div>

                            <Statistic
                                value={stat.value}
                                valueStyle={{
                                    color: '#111827',
                                    fontSize: 28,
                                    fontWeight: 700,
                                    lineHeight: 1.2,
                                }}
                            />

                            <Text
                                style={{
                                    display: 'block',
                                    color: '#94a3b8',
                                    fontSize: 12,
                                    marginTop: 8,
                                }}
                            >
                                {stat.description}
                            </Text>

                            {stat.title === 'Total Tasks' && (
                                <div style={{ marginTop: 16 }}>
                                    <Progress
                                        percent={completionRate}
                                        size="small"
                                        showInfo={false}
                                        strokeColor="#60a5fa"
                                        trailColor="#f1f5f9"
                                    />
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginTop: 6,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: '#94a3b8',
                                                fontSize: 11,
                                            }}
                                        >
                                            Completion rate
                                        </Text>
                                        <Text
                                            strong
                                            style={{
                                                color: '#3b82f6',
                                                fontSize: 11,
                                            }}
                                        >
                                            {completionRate}%
                                        </Text>
                                    </div>
                                </div>
                            )}

                            {stat.title === 'Completed Tasks' && (
                                <div
                                    style={{
                                        marginTop: 16,
                                        paddingTop: 12,
                                        borderTop: '1px solid #f1f5f9',
                                        minHeight: 34,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: highPriorityTasks > 0
                                                ? '#dc7373'
                                                : '#16a34a',
                                        }}
                                    >
                                        {highPriorityTasks > 0 ? (
                                            <>
                                                <FireOutlined /> {highPriorityTasks}{' '}
                                                prioritas tinggi tersisa
                                            </>
                                        ) : (
                                            'Semua prioritas tinggi beres'
                                        )}
                                    </Text>
                                </div>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};
