import React from 'react';
import { Card, Tag, Typography, Space, Button, Popconfirm, Avatar, Tooltip, Dropdown, type MenuProps } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined,
    UserOutlined,
    HolderOutlined,
    WarningOutlined,
    SwapOutlined,
} from '@ant-design/icons';
import { useDraggable } from '@dnd-kit/core';
import dayjs from 'dayjs';
import type { Priority, Status, Task } from '../../types';
import { DEFAULT_ASSIGNEES, useTaskStore } from '../../store/taskStore';

const { Text, Paragraph } = Typography;

interface TaskCardProps {
    task: Task;
    onEdit?: (task: Task) => void;
    onDelete?: (id: string) => void;
    isOverlay?: boolean;
}

const PRIORITY_CONFIG: Record<Priority, { color: string; label: string }> = {
    high: { color: 'error', label: 'HIGH' },
    medium: { color: 'warning', label: 'MEDIUM' },
    low: { color: 'success', label: 'LOW' },
};

const STATUS_LABELS: Record<Status, string> = {
    backlog: 'Backlog',
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
};

export const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onEdit,
    onDelete,
    isOverlay = false,
}) => {
    const { moveTask } = useTaskStore();
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        data: { task },
        disabled: isOverlay,
    });

    const assigneeData = DEFAULT_ASSIGNEES.find((a) => a.name === task.assignee);
    const isOverdue =
        task.dueDate &&
        dayjs(task.dueDate).isBefore(dayjs(), 'day') &&
        task.status !== 'done';

    const formattedDate = task.dueDate
        ? dayjs(task.dueDate).format('DD MMM YYYY')
        : 'Tanpa tenggat';

    const style: React.CSSProperties = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        opacity: isDragging ? 0.35 : 1,
        marginBottom: 10,
        borderRadius: 8,
        cursor: isOverlay ? 'grabbing' : 'grab',
        boxShadow: isOverlay
            ? '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
            : '0 1px 3px rgba(0,0,0,0.06)',
        transition: isDragging ? 'none' : 'box-shadow 0.2s, border-color 0.2s',
        border: isOverlay ? '2px solid #1890ff' : '1px solid #f0f0f0',
        transformOrigin: 'center center',
        rotate: isOverlay ? '2deg' : undefined,
        touchAction: 'none',
    };

    // Quick move dropdown items for mobile and quick desktop actions
    const quickStatusItems: MenuProps['items'] = [
        { key: 'backlog', label: 'Pindah ke Backlog', disabled: task.status === 'backlog' },
        { key: 'todo', label: 'Pindah ke To Do', disabled: task.status === 'todo' },
        { key: 'in_progress', label: 'Pindah ke In Progress', disabled: task.status === 'in_progress' },
        { key: 'done', label: 'Pindah ke Done', disabled: task.status === 'done' },
    ];

    const handleQuickStatusClick: MenuProps['onClick'] = (e) => {
        moveTask(task.id, e.key as Status);
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card
                size="small"
                styles={{
                    body: { padding: '10px 12px' },
                }}
                hoverable={!isOverlay}
            >
                {/* Header Card: Priority, Status Tag, Drag Handle */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 6,
                    }}
                >
                    <Space size={4}>
                        <Tag color={PRIORITY_CONFIG[task.priority].color} style={{ margin: 0, fontWeight: 600, fontSize: 10 }}>
                            {PRIORITY_CONFIG[task.priority].label}
                        </Tag>
                        <Tag style={{ margin: 0, fontSize: 10 }}>
                            {STATUS_LABELS[task.status]}
                        </Tag>
                    </Space>

                    <Tooltip title="Tarik kartu untuk memindahkan kolom">
                        <HolderOutlined style={{ color: '#bfbfbf', cursor: 'grab', fontSize: 13 }} />
                    </Tooltip>
                </div>

                {/* Task Title */}
                <Text
                    strong
                    style={{
                        fontSize: 13,
                        display: 'block',
                        marginBottom: 4,
                        lineHeight: 1.3,
                        color: task.status === 'done' ? '#8c8c8c' : '#1e293b',
                        textDecoration: task.status === 'done' ? 'line-through' : 'none',
                    }}
                >
                    {task.title}
                </Text>

                {/* Task Description */}
                <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{
                        fontSize: 12,
                        color: '#64748b',
                        marginBottom: 10,
                        lineHeight: 1.4,
                    }}
                >
                    {task.description}
                </Paragraph>

                {/* Card Meta: Due date & Assignee */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid #f8fafc',
                        paddingTop: 6,
                        marginTop: 2,
                    }}
                >
                    {/* Due Date */}
                    <Space size={3}>
                        <CalendarOutlined style={{ color: isOverdue ? '#ff4d4f' : '#94a3b8', fontSize: 11 }} />
                        <Text
                            style={{
                                fontSize: 11,
                                color: isOverdue ? '#ff4d4f' : '#64748b',
                                fontWeight: isOverdue ? 600 : 400,
                            }}
                        >
                            {formattedDate}
                        </Text>
                        {isOverdue && (
                            <Tooltip title="Tenggat waktu telah lewat!">
                                <WarningOutlined style={{ color: '#ff4d4f', fontSize: 11 }} />
                            </Tooltip>
                        )}
                    </Space>

                    {/* Assignee */}
                    {task.assignee ? (
                        <Tooltip title={`Assignee: ${task.assignee}`}>
                            <Space size={4}>
                                <Avatar
                                    size={20}
                                    src={assigneeData?.avatar}
                                    icon={<UserOutlined />}
                                    style={{ backgroundColor: '#1890ff', fontSize: 10 }}
                                />
                                <span style={{ fontSize: 11, color: '#475569', maxWidth: 80 }} className="truncate">
                                    {task.assignee.split(' ')[0]}
                                </span>
                            </Space>
                        </Tooltip>
                    ) : (
                        <span style={{ fontSize: 10, color: '#94a3b8', fontStyle: 'italic' }}>
                            Unassigned
                        </span>
                    )}
                </div>

                {/* Action Buttons (Edit, Quick Move, Delete) */}
                {!isOverlay && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 6,
                            paddingTop: 4,
                            borderTop: '1px dashed #f1f5f9',
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                    >
                        {/* Quick Status Move Dropdown (Very helpful on mobile!) */}
                        <Dropdown menu={{ items: quickStatusItems, onClick: handleQuickStatusClick }} trigger={['click']}>
                            <Button
                                type="text"
                                size="small"
                                icon={<SwapOutlined style={{ fontSize: 11, color: '#8b5cf6' }} />}
                                style={{ padding: '0 4px', height: 22, fontSize: 11, color: '#8b5cf6' }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                Pindah
                            </Button>
                        </Dropdown>

                        <div style={{ display: 'flex', gap: 2 }}>
                            {onEdit && (
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<EditOutlined style={{ fontSize: 11, color: '#1890ff' }} />}
                                    style={{ padding: '0 4px', height: 22, fontSize: 11 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(task);
                                    }}
                                >
                                    Edit
                                </Button>
                            )}
                            {onDelete && (
                                <Popconfirm
                                    title="Hapus Tugas"
                                    description="Apakah Anda yakin?"
                                    okText="Hapus"
                                    cancelText="Batal"
                                    okButtonProps={{ danger: true }}
                                    onConfirm={(e) => {
                                        e?.stopPropagation();
                                        onDelete(task.id);
                                    }}
                                >
                                    <Button
                                        type="text"
                                        danger
                                        size="small"
                                        icon={<DeleteOutlined style={{ fontSize: 11 }} />}
                                        style={{ padding: '0 4px', height: 22, fontSize: 11 }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Hapus
                                    </Button>
                                </Popconfirm>
                            )}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};
