
import React, { useState } from 'react';
import {
    Table,
    Tag,
    Button,
    Space,
    Card,
    Select,
    Popconfirm,
    Empty,
    message,
    Typography,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import type { Status, Task } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { TaskModal } from '../kanban/TaskModal';

const { Text, Title } = Typography;

const STATUS_COLORS: Record<Status, string> = {
    backlog: 'warning',
    todo: 'processing',
    in_progress: 'purple',
    done: 'success',
};

const STATUS_LABELS: Record<Status, string> = {
    backlog: 'Backlog',
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
};

const PRIORITY_COLORS: Record<string, string> = {
    high: 'red',
    medium: 'orange',
    low: 'green',
};

const cardStyle: React.CSSProperties = {
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
    overflow: 'hidden',
};

export const MyTasksView: React.FC = () => {
    const { user } = useAuthStore();
    const { tasks, updateTask, deleteTask } = useTaskStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const userFullName = user
        ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username
        : 'Emily Johnson';

    const userTasks = tasks.filter(
        (task) => task.assignee === userFullName
    );

    const handleStatusChange = (id: string, newStatus: Status) => {
        updateTask(id, { status: newStatus });
        message.success('Status tugas berhasil diperbarui!');
    };

    const handleDelete = (id: string) => {
        deleteTask(id);
        message.success('Tugas berhasil dihapus!');
    };

    const columns = [
        {
            title: 'JUDUL TUGAS',
            dataIndex: 'title',
            key: 'title',
            render: (title: string, record: Task) => (
                <div style={{ maxWidth: 360 }}>
                    <Text
                        strong
                        style={{
                            display: 'block',
                            color: '#1e293b',
                            fontSize: 14,
                            marginBottom: 3,
                        }}
                    >
                        {title}
                    </Text>
                    <Text
                        type="secondary"
                        style={{ fontSize: 12 }}
                        ellipsis={{ tooltip: record.description }}
                    >
                        {record.description || 'Tidak ada deskripsi'}
                    </Text>
                </div>
            ),
        },
        {
            title: 'PRIORITAS',
            dataIndex: 'priority',
            key: 'priority',
            width: 125,
            render: (priority: string) => (
                <Tag
                    color={PRIORITY_COLORS[priority] || 'default'}
                    style={{
                        borderRadius: 20,
                        fontWeight: 600,
                        fontSize: 11,
                        padding: '2px 10px',
                        border: 'none',
                    }}
                >
                    {priority.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            width: 160,
            render: (status: Status, record: Task) => (
                <Select
                    value={status}
                    size="middle"
                    style={{ width: 135 }}
                    variant="borderless"
                    onChange={(value: Status) =>
                        handleStatusChange(record.id, value)
                    }
                    options={(
                        Object.keys(STATUS_LABELS) as Status[]
                    ).map((key) => ({
                        value: key,
                        label: (
                            <Tag
                                color={STATUS_COLORS[key]}
                                style={{
                                    borderRadius: 20,
                                    border: 'none',
                                    margin: 0,
                                    fontSize: 11,
                                    fontWeight: 500,
                                }}
                            >
                                {STATUS_LABELS[key]}
                            </Tag>
                        ),
                    }))}
                />
            ),
        },
        {
            title: 'DUE DATE',
            dataIndex: 'dueDate',
            key: 'dueDate',
            width: 140,
            render: (date: string) => (
                <Text
                    style={{
                        fontSize: 13,
                        color: '#64748b',
                    }}
                >
                    {date ? dayjs(date).format('DD MMM YYYY') : '-'}
                </Text>
            ),
        },
        {
            title: 'AKSI',
            key: 'action',
            width: 150,
            render: (_: unknown, record: Task) => (
                <Space size={4}>
                    <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        style={{
                            color: '#2563eb',
                            fontWeight: 500,
                        }}
                        onClick={() => {
                            setEditingTask(record);
                            setModalOpen(true);
                        }}
                    >
                        Edit
                    </Button>

                    <Popconfirm
                        title="Hapus tugas?"
                        description="Apakah Anda yakin ingin menghapus tugas ini?"
                        okText="Hapus"
                        cancelText="Batal"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            style={{ fontWeight: 500 }}
                        >
                            Hapus
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ paddingBottom: 24 }}>
            {/* Page Header */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    marginBottom: 24,
                    flexWrap: 'wrap',
                }}
            >
                <div>
                    <Title
                        level={3}
                        style={{
                            margin: 0,
                            color: '#111827',
                            fontWeight: 700,
                        }}
                    >
                        Tugas Saya
                    </Title>

                    <Text style={{ color: '#64748b', fontSize: 14 }}>
                        Kelola dan pantau tugas yang ditugaskan kepada{' '}
                        <Text strong style={{ color: '#334155' }}>
                            {userFullName}
                        </Text>
                        .
                    </Text>
                </div>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingTask(null);
                        setModalOpen(true);
                    }}
                    style={{
                        height: 40,
                        borderRadius: 8,
                        background: '#2563eb',
                        boxShadow: 'none',
                        fontWeight: 500,
                    }}
                >
                    Tambah Tugas
                </Button>
            </div>

            {/* Task Summary */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 16,
                }}
            >
                <Text strong style={{ color: '#111827', fontSize: 14 }}>
                    Daftar Tugas
                </Text>

                <Tag
                    style={{
                        borderRadius: 20,
                        background: '#eff6ff',
                        color: '#2563eb',
                        border: 'none',
                        fontWeight: 600,
                        margin: 0,
                    }}
                >
                    {userTasks.length} tugas
                </Tag>
            </div>

            {/* Task Table */}
            <Card
                style={cardStyle}
                styles={{
                    body: { padding: 0 },
                }}
            >
                <Table
                    dataSource={userTasks}
                    columns={columns}
                    rowKey="id"
                    scroll={{ x: 750 }}
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} tugas`,
                        style: {
                            padding: '0 20px 12px',
                        },
                    }}
                    locale={{
                        emptyText: (
                            <Empty
                                description="Belum ada tugas yang ditugaskan kepada Anda."
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                style={{ padding: 32 }}
                            />
                        ),
                    }}
                />
            </Card>

            {/* Task Modal */}
            <TaskModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingTask(null);
                }}
                editingTask={editingTask}
                defaultStatus="todo"
            />
        </div>
    );
};
