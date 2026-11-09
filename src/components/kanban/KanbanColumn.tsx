import React from 'react';
import { Badge, Button, Empty, Tooltip } from 'antd';
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useDroppable } from '@dnd-kit/core';
import type { Status, Task } from '../../types';
import { TaskCard } from './TaskCard';

export interface ColumnDefinition {
    id: Status;
    title: string;
    description: string;
    color: string;
    bgColor: string;
}

interface KanbanColumnProps {
    column: ColumnDefinition;
    tasks: Task[];
    onAddTask: (defaultStatus: Status) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: string) => void;
    isSingleView?: boolean;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
    column,
    tasks,
    onAddTask,
    onEditTask,
    onDeleteTask,
    isSingleView = false,
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
    });

    return (
        <div
            className="kanban-column-wrapper"
            style={{
                flex: isSingleView ? '1 1 100%' : '1 1 280px',
                minWidth: isSingleView ? '100%' : 270,
                maxWidth: isSingleView ? '100%' : 360,
                background: '#f8fafc',
                borderRadius: 12,
                display: 'flex',
                flexDirection: 'column',
                border: isOver ? `2px dashed ${column.color}` : '1px solid #e2e8f0',
                backgroundColor: isOver ? '#f1f5f9' : '#f8fafc',
                transition: 'all 0.2s ease',
                maxHeight: 'calc(100vh - 240px)',
                minHeight: 380,
            }}
        >
            {/* Column Header */}
            <div
                style={{
                    padding: '12px 14px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#ffffff',
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    borderTop: `4px solid ${column.color}`,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>
                        {column.title}
                    </span>
                    <Badge
                        count={tasks.length}
                        style={{
                            backgroundColor: column.color,
                            boxShadow: 'none',
                            fontWeight: 600,
                            fontSize: 11,
                        }}
                    />
                    <Tooltip title={column.description}>
                        <InfoCircleOutlined style={{ color: '#94a3b8', fontSize: 12, cursor: 'pointer' }} />
                    </Tooltip>
                </div>

                <Tooltip title={`Tambah ke ${column.title}`}>
                    <Button
                        type="text"
                        size="small"
                        icon={<PlusOutlined />}
                        style={{ color: '#64748b' }}
                        onClick={() => onAddTask(column.id)}
                    />
                </Tooltip>
            </div>

            {/* Droppable Task Container */}
            <div
                ref={setNodeRef}
                style={{
                    padding: 10,
                    flex: 1,
                    overflowY: 'auto',
                    minHeight: 160,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                        />
                    ))
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 24,
                        }}
                    >
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span style={{ color: '#94a3b8', fontSize: 12 }}>
                                    {isOver ? 'Lepaskan di sini' : 'Belum ada tugas'}
                                </span>
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
