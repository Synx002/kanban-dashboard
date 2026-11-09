import React, { useState } from 'react';
import { Table, Tag, Button, Space, Card, Select, Popconfirm, Empty, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Status, Task } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import { TaskModal } from '../kanban/TaskModal';

const { Option } = Select;

const STATUS_COLORS: Record<Status, string> = {
    backlog: 'warning',
    todo: 'processing',
    in_progress: 'purple',
    done: 'success',
};

const PRIORITY_COLORS: Record<string, string> = {
    high: 'red',
    medium: 'orange',
    low: 'green',
};

export const MyTasksView: React.FC = () => {
    const { user } = useAuthStore();
    const { tasks, updateTask, deleteTask } = useTaskStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const userFullName = user
        ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username
        : 'Emily Johnson';

    // Filter tasks for this user
    const userTasks = tasks.filter(
        (t) => t.assignee === userFullName || t.assignee === 'Emily Johnson'
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
            title: 'Judul Tugas',
            dataIndex: 'title',
            key: 'title',
            render: (title: string, record: Task) => (
                <div>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{title}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{record.description}</div>
                </div>
            ),
        },
        {
            title: 'Prioritas',
            dataIndex: 'priority',
            key: 'priority',
            width: 120,
            render: (priority: string) => (
                <Tag color={PRIORITY_COLORS[priority]} style={{ fontWeight: 600 }}>
                    {priority.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 160,
            render: (status: Status, record: Task) => (
                <Select
                    value={status}
                    size="small"
                    style={{ width: 130 }}
                    onChange={(val) => handleStatusChange(record.id, val)}
                >
                    <Option value="backlog">
                        <Tag color={STATUS_COLORS.backlog}>Backlog</Tag>
                    </Option>
                    <Option value="todo">
                        <Tag color={STATUS_COLORS.todo}>To Do</Tag>
                    </Option>
                    <Option value="in_progress">
                        <Tag color={STATUS_COLORS.in_progress}>In Progress</Tag>
                    </Option>
                    <Option value="done">
                        <Tag color={STATUS_COLORS.done}>Done</Tag>
                    </Option>
                </Select>
            ),
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
            width: 140,
            render: (date: string) => (
                <span style={{ fontSize: 13, color: '#475569' }}>
                    {date ? dayjs(date).format('DD MMM YYYY') : '-'}
                </span>
            ),
        },
        {
            title: 'Aksi',
            key: 'action',
            width: 140,
            render: (_: unknown, record: Task) => (
                <Space size="small">
                    <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined style={{ color: '#1890ff' }} />}
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
                        >
                            Hapus
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 20,
                }}
            >
                <div>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Tugas Saya</h2>
                    <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>
                        Menampilkan tugas yang ditugaskan kepada <strong>{userFullName}</strong> ({userTasks.length} tugas)
                    </p>
                </div>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingTask(null);
                        setModalOpen(true);
                    }}
                >
                    Tambah Tugas Saya
                </Button>
            </div>

            <Card styles={{ body: { padding: 0 } }} style={{ borderRadius: 10, overflow: 'hidden' }}>
                <Table
                    dataSource={userTasks}
                    columns={columns}
                    rowKey="id"
                    pagination={{ pageSize: 8 }}
                    locale={{
                        emptyText: (
                            <Empty
                                description="Tidak ada tugas yang ditugaskan kepada Anda saat ini."
                                style={{ padding: 32 }}
                            />
                        ),
                    }}
                />
            </Card>

            <TaskModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                editingTask={editingTask}
                defaultStatus="todo"
            />
        </div>
    );
};

