import { create } from 'zustand';
import type { Priority, Status, Task } from '../types';

export const DEFAULT_ASSIGNEES = [
    { name: 'Emily Johnson', role: 'Office Manager', avatar: 'https://dummyjson.com/icon/emilys/128' },
    { name: 'Michael Brown', role: 'Finance Staff', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
    { name: 'Sophia Wilson', role: 'HR Specialist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia' },
    { name: 'Alexander Davis', role: 'Marketing Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { name: 'Olivia Taylor', role: 'Sales Executive', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia' },
];

export const LOCAL_STORAGE_KEY = 'kanban_tasks';

export const INITIAL_TASKS: Task[] = [
    {
        id: 'task-1',
        title: 'Susun Laporan Keuangan Bulanan',
        description: 'Rekap pemasukan dan pengeluaran Oktober, lalu kirim ke direktur untuk ditinjau.',
        priority: 'high',
        status: 'done',
        dueDate: '2026-11-04',
        assignee: 'Michael Brown',
        createdAt: '2026-10-28T08:00:00.000Z',
        updatedAt: '2026-11-03T15:30:00.000Z',
    },
    {
        id: 'task-2',
        title: 'Perpanjang Kontrak Vendor Kebersihan',
        description: 'Negosiasi harga dan tanda tangan kontrak perpanjangan untuk periode 2027.',
        priority: 'medium',
        status: 'done',
        dueDate: '2026-11-06',
        assignee: 'Emily Johnson',
        createdAt: '2026-10-29T09:00:00.000Z',
        updatedAt: '2026-11-05T11:00:00.000Z',
    },
    {
        id: 'task-3',
        title: 'Rekrutmen Staf Administrasi',
        description: 'Screening CV, jadwalkan wawancara tahap pertama, dan siapkan penilaian kandidat.',
        priority: 'high',
        status: 'in_progress',
        dueDate: '2026-11-13',
        assignee: 'Sophia Wilson',
        createdAt: '2026-11-01T10:00:00.000Z',
        updatedAt: '2026-11-08T09:15:00.000Z',
    },
    {
        id: 'task-4',
        title: 'Siapkan Materi Kampanye Akhir Tahun',
        description: 'Buat konten promosi, jadwal posting media sosial, dan anggaran iklan Desember.',
        priority: 'medium',
        status: 'in_progress',
        dueDate: '2026-11-16',
        assignee: 'Alexander Davis',
        createdAt: '2026-11-02T13:00:00.000Z',
        updatedAt: '2026-11-08T10:00:00.000Z',
    },
    {
        id: 'task-5',
        title: 'Follow Up Penawaran Klien Prioritas',
        description: 'Hubungi tiga klien yang belum membalas penawaran dan catat hasilnya di CRM.',
        priority: 'high',
        status: 'todo',
        dueDate: '2026-11-20',
        assignee: 'Olivia Taylor',
        createdAt: '2026-11-04T10:00:00.000Z',
        updatedAt: '2026-11-04T10:00:00.000Z',
    },
    {
        id: 'task-6',
        title: 'Jadwalkan Rapat Evaluasi Kuartal IV',
        description: 'Kirim undangan rapat, siapkan agenda, dan pesan ruang meeting untuk seluruh divisi.',
        priority: 'low',
        status: 'todo',
        dueDate: '2026-11-25',
        assignee: 'Emily Johnson',
        createdAt: '2026-11-05T15:00:00.000Z',
        updatedAt: '2026-11-05T15:00:00.000Z',
    },
    {
        id: 'task-7',
        title: 'Update Dokumen SOP Pengajuan Cuti',
        description: 'Revisi alur persetujuan cuti dan sosialisasikan ke seluruh karyawan.',
        priority: 'medium',
        status: 'backlog',
        dueDate: '2026-12-05',
        assignee: 'Sophia Wilson',
        createdAt: '2026-11-06T09:30:00.000Z',
        updatedAt: '2026-11-06T09:30:00.000Z',
    },
    {
        id: 'task-8',
        title: 'Rencanakan Anggaran Operasional 2027',
        description: 'Kumpulkan usulan anggaran tiap divisi dan susun draf awal untuk pembahasan manajemen.',
        priority: 'low',
        status: 'backlog',
        dueDate: '2026-12-15',
        assignee: 'Michael Brown',
        createdAt: '2026-11-06T16:00:00.000Z',
        updatedAt: '2026-11-06T16:00:00.000Z',
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

