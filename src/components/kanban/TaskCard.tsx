import React from 'react';
import { Card, Tag, Typography, Space, Button, Popconfirm, Avatar, Tooltip } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    CalendarOutlined,
    UserOutlined,
    HolderOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { useDraggable } from '@dnd-kit/core';
import dayjs from 'dayjs';
import type { Priority, Status, Task } from '../../types';
import { DEFAULT_ASSIGNEES } from '../../store/taskStore';

const { Text, Paragraph } = Typography;

interface TaskCardProps {
    task: Task;
    onEdit?: (task: Task) => void;
    onDelete?: (id: string) => void;
    onQuickStatusChange?: (id: string, newStatus: Status) => void;
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
        marginBottom: 12,
        borderRadius: 8,
        cursor: isOverlay ? 'grabbing' : 'grab',
        boxShadow: isOverlay
            ? '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
            : '0 1px 3px rgba(0,0,0,0.06)',
        transition: isDragging ? 'none' : 'box-shadow 0.2s, border-color 0.2s',
        border: isOverlay ? '2px solid #1890ff' : '1px solid #f0f0f0',
        transformOrigin: 'center center',
        rotate: isOverlay ? '2deg' : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card
                size="small"
                styles={{
                    body: { padding: '12px 14px' },
                }}
                hoverable={!isOverlay}
            >
                {/* Header Card: Priority, Status Tag, Drag Handle */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8,
                    }}
                >
                    <Space size={4}>
                        <Tag color={PRIORITY_CONFIG[task.priority].color} style={{ margin: 0, fontWeight: 600 }}>
                            {PRIORITY_CONFIG[task.priority].label}
                        </Tag>
                        <Tag style={{ margin: 0, fontSize: 11 }}>
                            {STATUS_LABELS[task.status]}
                        </Tag>
                    </Space>

                    <Tooltip title="Tarik kartu untuk memindahkan kolom">
                        <HolderOutlined style={{ color: '#bfbfbf', cursor: 'grab' }} />
                    </Tooltip>
                </div>

                {/* Task Title */}
                <Text
                    strong
                    style={{
                        fontSize: 14,
                        display: 'block',
                        marginBottom: 6,
                        lineHeight: 1.3,
                        color: task.status === 'done' ? '#8c8c8c' : '#262626',
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
                        color: '#666',
                        marginBottom: 12,
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
                        borderTop: '1px solid #f5f5f5',
                        paddingTop: 8,
                        marginTop: 4,
                    }}
                >
                    {/* Due Date */}
                    <Space size={4}>
                        <CalendarOutlined style={{ color: isOverdue ? '#ff4d4f' : '#8c8c8c', fontSize: 12 }} />
                        <Text
                            style={{
                                fontSize: 12,
                                color: isOverdue ? '#ff4d4f' : '#8c8c8c',
                                fontWeight: isOverdue ? 600 : 400,
                            }}
                        >
                            {formattedDate}
                        </Text>
                        {isOverdue && (
                            <Tooltip title="Tenggat waktu telah lewat!">
                                <WarningOutlined style={{ color: '#ff4d4f', fontSize: 12 }} />
                            </Tooltip>
                        )}
                    </Space>

                    {/* Assignee */}
                    {task.assignee ? (
                        <Tooltip title={`Assignee: ${task.assignee}`}>
                            <Space size={4}>
                                <Avatar
                                    size={22}
                                    src={assigneeData?.avatar}
                                    icon={<UserOutlined />}
                                    style={{ backgroundColor: '#1890ff' }}
                                />
                                <span style={{ fontSize: 11, color: '#595959', maxWidth: 90 }} className="truncate">
                                    {task.assignee.split(' ')[0]}
                                </span>
                            </Space>
                        </Tooltip>
                    ) : (
                        <span style={{ fontSize: 11, color: '#bfbfbf', fontStyle: 'italic' }}>
                            Unassigned
                        </span>
                    )}
                </div>

                {/* Action Buttons (Edit & Delete) - Only render when not in DragOverlay */}
                {!isOverlay && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 4,
                            marginTop: 8,
                            paddingTop: 6,
                            borderTop: '1px dashed #f0f0f0',
                        }}
                        onPointerDown={(e) => e.stopPropagation()} // Prevent drag start when clicking actions
                    >
                        {onEdit && (
                            <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined style={{ fontSize: 12, color: '#1890ff' }} />}
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
                                description="Apakah Anda yakin ingin menghapus tugas ini?"
                                okText="Ya, Hapus"
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
                                    icon={<DeleteOutlined style={{ fontSize: 12 }} />}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Hapus
                                </Button>
                            </Popconfirm>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

