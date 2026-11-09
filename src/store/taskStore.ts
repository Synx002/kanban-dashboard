import { create } from 'zustand';
import type { Priority, Status, Task } from '../types';

export const DEFAULT_ASSIGNEES = [
    { name: 'Emily Johnson', role: 'Product Manager', avatar: 'https://dummyjson.com/icon/emilys/128' },
    { name: 'Michael Brown', role: 'Frontend Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
    { name: 'Sophia Wilson', role: 'UI/UX Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia' },
    { name: 'Alexander Davis', role: 'Backend Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { name: 'Olivia Taylor', role: 'QA Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia' },
];

const LOCAL_STORAGE_KEY = 'kanban_tasks';

const INITIAL_TASKS: Task[] = [
    {
        id: 'task-1',
        title: 'Setup Project & Environment',
        description: 'Inisialisasi Vite React TypeScript dan konfigurasi Ant Design.',
        priority: 'high',
        status: 'done',
        dueDate: '2026-04-05',
        assignee: 'Emily Johnson',
        createdAt: '2026-04-01T08:00:00.000Z',
        updatedAt: '2026-04-05T10:00:00.000Z',
    },
    {
        id: 'task-2',
        title: 'Implement Authentication & Protected Routes',
        description: 'Integrasi DummyJSON login API, token storage, dan auto-refresh token.',
        priority: 'high',
        status: 'done',
        dueDate: '2026-04-08',
        assignee: 'Emily Johnson',
        createdAt: '2026-04-02T09:00:00.000Z',
        updatedAt: '2026-04-08T14:30:00.000Z',
    },
    {
        id: 'task-3',
        title: 'Develop Kanban Board & Drag and Drop',
        description: 'Implementasi 4 kolom status kanban dan perpindahan kartu dengan @dnd-kit.',
        priority: 'high',
        status: 'in_progress',
        dueDate: '2026-04-12',
        assignee: 'Michael Brown',
        createdAt: '2026-04-04T11:00:00.000Z',
        updatedAt: '2026-04-09T08:15:00.000Z',
    },
    {
        id: 'task-4',
        title: 'Implement Search & Multi-filter',
        description: 'Pencarian task berdasarkan title dan filter kombinasi priority, assignee, status, dan due date.',
        priority: 'medium',
        status: 'in_progress',
        dueDate: '2026-04-14',
        assignee: 'Sophia Wilson',
        createdAt: '2026-04-05T13:00:00.000Z',
        updatedAt: '2026-04-09T10:00:00.000Z',
    },
    {
        id: 'task-5',
        title: 'Responsive Design & Mobile Layout',
        description: 'Pastikan tata letak dashboard dan kanban board optimal di tablet dan smartphone.',
        priority: 'medium',
        status: 'todo',
        dueDate: '2026-04-18',
        assignee: 'Sophia Wilson',
        createdAt: '2026-04-06T10:00:00.000Z',
        updatedAt: '2026-04-06T10:00:00.000Z',
    },
    {
        id: 'task-6',
        title: 'Add Automated Tests & E2E Testing',
        description: 'Buat unit test untuk store Zustand dan skenario CRUD task.',
        priority: 'low',
        status: 'todo',
        dueDate: '2026-04-20',
        assignee: 'Olivia Taylor',
        createdAt: '2026-04-07T15:00:00.000Z',
        updatedAt: '2026-04-07T15:00:00.000Z',
    },
    {
        id: 'task-7',
        title: 'Performance Audit & Bundle Splitting',
        description: 'Optimasi ukuran bundle chunk vendor dan lazy loading pada halaman aplikasi.',
        priority: 'medium',
        status: 'backlog',
        dueDate: '2026-04-25',
        assignee: 'Alexander Davis',
        createdAt: '2026-04-08T09:30:00.000Z',
        updatedAt: '2026-04-08T09:30:00.000Z',
    },
    {
        id: 'task-8',
        title: 'Dark Mode Theme Support',
        description: 'Eksplorasi tema gelap kustom menggunakan ConfigProvider Ant Design.',
        priority: 'low',
        status: 'backlog',
        dueDate: '2026-04-30',
        assignee: 'Michael Brown',
        createdAt: '2026-04-08T16:00:00.000Z',
        updatedAt: '2026-04-08T16:00:00.000Z',
    },
];

const loadTasksFromStorage = (): Task[] => {
    try {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch {
        // Abaikan error parse
    }
    // Jika belum ada atau kosong, simpan data awal
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
    return INITIAL_TASKS;
};

const saveTasksToStorage = (tasks: Task[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
};

export interface TaskFilterState {
    search: string;
    priority: Priority | 'all';
    assignee: string | 'all';
    status: Status | 'all';
    dueDate: string | null;
}

interface TaskState {
    tasks: Task[];
    filters: TaskFilterState;

    // CRUD
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
    deleteTask: (id: string) => void;
    moveTask: (id: string, newStatus: Status) => void;

    // Filters
    setSearch: (search: string) => void;
    setFilterPriority: (priority: Priority | 'all') => void;
    setFilterAssignee: (assignee: string | 'all') => void;
    setFilterStatus: (status: Status | 'all') => void;
    setFilterDueDate: (dueDate: string | null) => void;
    resetFilters: () => void;
    resetToDefaultTasks: () => void;

    // Filtered getter
    getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: loadTasksFromStorage(),
    filters: {
        search: '',
        priority: 'all',
        assignee: 'all',
        status: 'all',
        dueDate: null,
    },

    addTask: (taskData) => {
        const now = new Date().toISOString();
        const newTask: Task = {
            ...taskData,
            id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            createdAt: now,
            updatedAt: now,
        };
        set((state) => {
            const updated = [newTask, ...state.tasks];
            saveTasksToStorage(updated);
            return { tasks: updated };
        });
    },

    updateTask: (id, updates) => {
        set((state) => {
            const now = new Date().toISOString();
            const updated = state.tasks.map((task) =>
                task.id === id ? { ...task, ...updates, updatedAt: now } : task
            );
            saveTasksToStorage(updated);
            return { tasks: updated };
        });
    },

    deleteTask: (id) => {
        set((state) => {
            const updated = state.tasks.filter((task) => task.id !== id);
            saveTasksToStorage(updated);
            return { tasks: updated };
        });
    },

    moveTask: (id, newStatus) => {
        set((state) => {
            const currentTask = state.tasks.find((t) => t.id === id);
            if (!currentTask || currentTask.status === newStatus) {
                return state;
            }
            const now = new Date().toISOString();
            const updated = state.tasks.map((task) =>
                task.id === id ? { ...task, status: newStatus, updatedAt: now } : task
            );
            saveTasksToStorage(updated);
            return { tasks: updated };
        });
    },

    setSearch: (search) => {
        set((state) => ({ filters: { ...state.filters, search } }));
    },

    setFilterPriority: (priority) => {
        set((state) => ({ filters: { ...state.filters, priority } }));
    },

    setFilterAssignee: (assignee) => {
        set((state) => ({ filters: { ...state.filters, assignee } }));
    },

    setFilterStatus: (status) => {
        set((state) => ({ filters: { ...state.filters, status } }));
    },

    setFilterDueDate: (dueDate) => {
        set((state) => ({ filters: { ...state.filters, dueDate } }));
    },

    resetFilters: () => {
        set({
            filters: {
                search: '',
                priority: 'all',
                assignee: 'all',
                status: 'all',
                dueDate: null,
            },
        });
    },

    resetToDefaultTasks: () => {
        saveTasksToStorage(INITIAL_TASKS);
        set({ tasks: INITIAL_TASKS });
    },

    getFilteredTasks: () => {
        const { tasks, filters } = get();
        return tasks.filter((task) => {
            // Search by title
            if (filters.search.trim()) {
                const query = filters.search.toLowerCase().trim();
                const matchTitle = task.title.toLowerCase().includes(query);
                const matchDesc = task.description.toLowerCase().includes(query);
                if (!matchTitle && !matchDesc) return false;
            }

            // Filter priority
            if (filters.priority !== 'all' && task.priority !== filters.priority) {
                return false;
            }

            // Filter assignee
            if (filters.assignee !== 'all' && task.assignee !== filters.assignee) {
                return false;
            }

            // Filter status
            if (filters.status !== 'all' && task.status !== filters.status) {
                return false;
            }

            // Filter due date (exact date or match)
            if (filters.dueDate && task.dueDate !== filters.dueDate) {
                return false;
            }

            return true;
        });
    },
}));

