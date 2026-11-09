# Kanban Task Management Dashboard

Aplikasi Task Management berbasis Kanban Board untuk mengelola pekerjaan kantor secara terorganisir. Dibuat sebagai Frontend Developer Practical Test menggunakan React, TypeScript, dan Ant Design.

## Daftar Isi

- [Fitur](#fitur)
- [Teknologi](#teknologi)
- [Cara Menjalankan](#cara-menjalankan)
- [Akun Pengujian](#akun-pengujian)
- [Struktur Folder](#struktur-folder)
- [Keputusan Teknis](#keputusan-teknis)
- [Model Data](#model-data)
- [Penanganan Error](#penanganan-error)
- [Asumsi & Catatan](#asumsi--catatan)

## Fitur

### Autentikasi
- Halaman login dengan validasi username dan password
- Autentikasi melalui DummyJSON Auth API menggunakan Axios
- Access token disimpan dan session dipertahankan saat browser di-refresh
- Protected Route untuk halaman dashboard
- Pesan error informatif saat login gagal, serta loading state selama proses autentikasi
- Logout yang membersihkan token dan mengarahkan ke halaman login
- **Bonus:** refresh token otomatis melalui endpoint `/auth/refresh`

### Dashboard
- Sidebar navigasi (Dashboard, My Tasks, Settings, Logout)
- Header dengan informasi pengguna yang sedang login
- Kartu ringkasan statistik (Total, Backlog, In Progress, Completed) yang dihitung dari data task, bukan angka statis
- Search dan filter task

### Kanban Board
- Empat kolom status: **Backlog**, **To Do**, **In Progress**, **Done**
- Kartu task menampilkan title, description, priority, due date, assignee, dan status
- Drag and drop antar kolom menggunakan `@dnd-kit/core`
- Perubahan status akibat drag and drop langsung tersimpan

### Manajemen Task (CRUD)
- **Create:** tombol Add Task membuka form modal
- **Read:** seluruh task tampil pada Kanban Board
- **Update:** edit informasi task melalui modal
- **Delete:** dengan dialog konfirmasi sebelum data dihapus
- Penyimpanan di `localStorage`, data tetap ada setelah refresh

### Search & Filter
- Search berdasarkan judul task
- Filter berdasarkan priority, assignee, due date, dan status
- Semua filter dapat dikombinasikan

### UI/UX
- Tampilan modern dan konsisten (Ant Design)
- Layout responsif untuk desktop, tablet, dan mobile
- Loading indicator, empty state, dan validasi form

## Teknologi

| Kebutuhan | Teknologi |
|---|---|
| Framework | React.js + TypeScript (Vite) |
| HTTP Client | Axios |
| UI Library | Ant Design |
| Routing | React Router |
| State Management | Zustand (dengan middleware `persist`) |
| Drag & Drop | @dnd-kit/core |
| Tanggal | Day.js |
| Database | Local Storage |

## Cara Menjalankan

### Prasyarat
- Node.js 18 atau lebih baru
- npm (atau yarn/pnpm)

### Langkah

```bash
# 1. Clone repository
git clone <url-repository-anda>
cd kanban-dashboard

# 2. Install dependency
npm install

# 3. Jalankan mode development
npm run dev
```

Buka `http://localhost:5173` di browser.

### Script Lain

```bash
npm run build     # build untuk production
npm run preview   # preview hasil build
npm run lint      # cek kualitas kode
```

## Akun Pengujian

Gunakan akun dari DummyJSON:

| Field | Nilai |
|---|---|
| Username | `emilys` |
| Password | `emilyspass` |

Dokumentasi API: <https://dummyjson.com/docs/auth>

## Struktur Folder

```
src/
├── api/          # Axios instance, interceptor, service autentikasi
├── components/   # Komponen reusable (TaskCard, TaskColumn, TaskFormModal, StatsCards, FilterBar)
├── constants/    # Data awal task dan daftar assignee
├── hooks/        # Custom hooks (mis. useFilteredTasks)
├── layouts/      # DashboardLayout (sidebar + header)
├── pages/        # LoginPage, DashboardPage, MyTasksPage, SettingsPage
├── routes/       # ProtectedRoute
├── store/        # Zustand store (auth dan task)
└── types/        # Definisi tipe TypeScript
```

## Keputusan Teknis

**Axios instance terpusat.** Seluruh komunikasi API memakai satu instance dengan `baseURL` DummyJSON dan timeout, sehingga konfigurasi tidak tersebar.

**Interceptor request dan response.**
- *Request:* menambahkan header `Authorization: Bearer <token>` secara otomatis.
- *Response:* saat menerima `401`, interceptor mencoba refresh token satu kali lalu mengulang request asli. Jika refresh gagal, token dibersihkan dan pengguna diarahkan ke halaman login.

**Zustand + persist.** State management ringan tanpa boilerplate. Middleware `persist` menyimpan data task ke `localStorage` secara otomatis sehingga operasi CRUD dan drag and drop langsung tersimpan.

**Pemulihan session.** Saat aplikasi dibuka, token dari `localStorage` divalidasi melalui `GET /auth/me`. Selama proses ini `ProtectedRoute` menampilkan loading agar tidak terjadi redirect ke login secara keliru.

**dnd-kit dengan drag handle.** Kolom bertindak sebagai area droppable dan kartu sebagai draggable. Drag diaktifkan hanya dari judul kartu dan sensor memakai `distance` aktivasi, sehingga tombol Edit dan Hapus di kartu tetap dapat diklik.

**Separation of concerns.** Logika filter dipisah ke custom hook, akses API ke folder `api`, dan state ke folder `store`, sehingga komponen UI tetap fokus pada tampilan.

## Model Data

```ts
interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "backlog" | "todo" | "in_progress" | "done";
  dueDate: string;      // format YYYY-MM-DD
  assignee?: string;
  createdAt: string;    // ISO 8601
  updatedAt: string;    // ISO 8601
}
```

Setiap task memiliki ID unik yang dibuat dengan `crypto.randomUUID()`.

## Penanganan Error

| Kondisi | Perilaku |
|---|---|
| Kredensial salah | Pesan error ditampilkan pada form login |
| `401` | Mencoba refresh token; jika gagal, logout dan arahkan ke login |
| `403` | Menampilkan pesan bahwa pengguna tidak memiliki akses |
| `5xx` | Menampilkan pesan kesalahan server |
| Timeout / jaringan | Menampilkan pesan koneksi bermasalah |

## Asumsi & Catatan

- DummyJSON hanya digunakan untuk autentikasi. Data task dan daftar assignee bersifat lokal (statis), sesuai ketentuan soal.
- Data awal berupa contoh task kantoran dan dimuat saat `localStorage` masih kosong. Untuk mengembalikan data awal, hapus key `kanban_tasks` dari `localStorage` lalu refresh halaman.
- Token DummyJSON dibuat dengan masa berlaku 30 menit (`expiresInMins: 30`).
- Avatar assignee selain Emily Johnson memakai layanan DiceBear dan membutuhkan koneksi internet.

## Lisensi

Proyek ini dibuat untuk keperluan assessment.