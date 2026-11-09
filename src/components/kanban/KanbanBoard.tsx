import React, { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragEndEvent,
} from '@dnd-kit/core';
import { message } from 'antd';
import type { Status, Task } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import { KanbanColumn, type ColumnDefinition } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';

const COLUMNS: ColumnDefinition[] = [
    {
        id: 'backlog',
        title: 'Backlog',
        description: 'Tugas yang belum dikerjakan',
        color: '#f59e0b',
        bgColor: '#fffbeb',
    },
    {
        id: 'todo',
        title: 'To Do',
        description: 'Tugas yang siap dikerjakan',
        color: '#3b82f6',
        bgColor: '#eff6ff',
    },
    {
        id: 'in_progress',
        title: 'In Progress',
        description: 'Tugas yang sedang dikerjakan',
        color: '#8b5cf6',
        bgColor: '#f5f3ff',
    },
    {
        id: 'done',
        title: 'Done',
        description: 'Tugas yang telah selesai',
        color: '#10b981',
        bgColor: '#ecfdf5',
    },
];

export const KanbanBoard: React.FC = () => {
    const { getFilteredTasks, moveTask, deleteTask } = useTaskStore();
    const filteredTasks = getFilteredTasks();

    // Drag & Drop State
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [targetStatus, setTargetStatus] = useState<Status>('backlog');

    // Sensors setup (PointerSensor with 5px distance to avoid accidental drags when clicking buttons)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = filteredTasks.find((t) => t.id === active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        let destinationStatus: Status | null = null;

        // Cek apakah overId adalah salah satu ID kolom
        if (COLUMNS.some((col) => col.id === overId)) {
            destinationStatus = overId as Status;
        } else {
            // Jika di-drop di atas task lain, ambil status dari task tujuan
            const overTask = filteredTasks.find((t) => t.id === overId);
            if (overTask) {
                destinationStatus = overTask.status;
            }
        }

        if (destinationStatus) {
            const currentTask = filteredTasks.find((t) => t.id === activeId);
            if (currentTask && currentTask.status !== destinationStatus) {
                moveTask(activeId, destinationStatus);
                message.info(
                    `Tugas dipindahkan ke ${COLUMNS.find((c) => c.id === destinationStatus)?.title}`
                );
            }
        }
    };

    const handleOpenAddModal = (status: Status = 'backlog') => {
        setEditingTask(null);
        setTargetStatus(status);
        setModalOpen(true);
    };

    const handleOpenEditModal = (task: Task) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    const handleDeleteTask = (id: string) => {
        deleteTask(id);
        message.success('Tugas berhasil dihapus!');
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div
                style={{
                    display: 'flex',
                    gap: 16,
                    overflowX: 'auto',
                    paddingBottom: 16,
                    minHeight: 520,
                    alignItems: 'flex-start',
                }}
            >
                {COLUMNS.map((column) => {
                    const columnTasks = filteredTasks.filter(
                        (task) => task.status === column.id
                    );

                    return (
                        <KanbanColumn
                            key={column.id}
                            column={column}
                            tasks={columnTasks}
                            onAddTask={handleOpenAddModal}
                            onEditTask={handleOpenEditModal}
                            onDeleteTask={handleDeleteTask}
                        />
                    );
                })}
            </div>

            {/* Drag Overlay Preview */}
            <DragOverlay dropAnimation={null}>
                {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
            </DragOverlay>

            {/* Create & Edit Modal */}
            <TaskModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                editingTask={editingTask}
                defaultStatus={targetStatus}
            />
        </DndContext>
    );
};

