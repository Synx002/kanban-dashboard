import { useState } from 'react';
import { Layout, Menu, Avatar, Space, Button, message } from 'antd';
import {
    DashboardOutlined,
    UnorderedListOutlined,
    SettingOutlined,
    LogoutOutlined,
    UserOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { TaskFilters } from '../components/kanban/TaskFilters';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { MyTasksView } from '../components/dashboard/MyTasksView';
import { SettingsView } from '../components/dashboard/SettingsView';
import { TaskModal } from '../components/kanban/TaskModal';

const { Header, Sider, Content } = Layout;

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<'dashboard' | 'tasks' | 'settings'>('dashboard');
    const [createModalOpen, setCreateModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        message.success('Berhasil logout');
        navigate('/login', { replace: true });
    };

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: 'tasks',
            icon: <UnorderedListOutlined />,
            label: 'My Tasks',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        }
    ];

    const fullName = user
        ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username
        : 'Emily Johnson';

    return (
        <Layout style={{ minHeight: '100vh', background: '#f1f5f9' }}>

            {/* Sidebar Navigation */}
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                theme="dark"
                width={250}
                collapsedWidth={80}
                trigger={null}
                style={{
                    background: '#111827',
                    boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
                    borderRight: '1px solid #1f2937',
                }}
            >
                {/* Brand / Logo */}
                <div
                    style={{
                        height: 72,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        padding: collapsed ? 0 : '0 24px',
                        gap: 12,
                        borderBottom: '1px solid #273244',
                    }}
                >
                    <div
                        style={{
                            width: 38,
                            height: 38,
                            minWidth: 38,
                            borderRadius: 11,
                            background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: 21,
                            fontWeight: 800,
                            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                        }}
                    >
                        ✦
                    </div>

                    {!collapsed && (
                        <div>
                            <div
                                style={{
                                    fontSize: 18,
                                    fontWeight: 750,
                                    color: '#f9fafb',
                                    letterSpacing: '-0.6px',
                                    lineHeight: 1.3,
                                }}
                            >
                                TaskMaster
                            </div>
                            <div
                                style={{
                                    fontSize: 10,
                                    color: '#94a3b8',
                                    letterSpacing: '1.2px',
                                    fontWeight: 600,
                                    marginTop: 3,
                                }}
                            >
                                WORKSPACE
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Label */}
                {!collapsed && (
                    <div
                        style={{
                            padding: '26px 24px 10px',
                            color: '#64748b',
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: '1.3px',
                        }}
                    >
                        MAIN MENU
                    </div>
                )}

                {/* Sidebar Menu */}
                <Menu
                    theme="dark"
                    selectedKeys={[selectedMenu]}
                    mode="inline"
                    items={menuItems}
                    onClick={({ key }) => {
                        setSelectedMenu(
                            key as 'dashboard' | 'tasks' | 'settings'
                        );
                    }}
                    style={{
                        background: 'transparent',
                        borderRight: 0,
                        padding: collapsed ? '12px 8px' : '8px 12px',
                        fontSize: 13,
                        fontWeight: 500,
                    }}
                />

                {/* Bottom Section */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: collapsed ? '16px 8px' : '20px 16px',
                        borderTop: '1px solid #273244',
                    }}
                >
                    {!collapsed && (
                        <div
                            style={{
                                padding: 12,
                                background: '#1f2937',
                                borderRadius: 10,
                                color: '#cbd5e1',
                            }}
                        >
                            <div style={{ fontSize: 11, fontWeight: 600 }}>
                                TaskMaster Workspace
                            </div>
                            <div
                                style={{
                                    fontSize: 10,
                                    color: '#94a3b8',
                                    marginTop: 5,
                                }}
                            >
                                Manage your work efficiently.
                            </div>
                        </div>
                    )}
                </div>
            </Sider>


            {/* Main Layout Area */}
            <Layout style={{ background: '#f8fafc' }}>
                {/* Header */}
                <Header
                    style={{
                        height: 68,
                        padding: '0 24px',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                        lineHeight: 'normal',
                    }}
                >
                    {/* Left Section: Title & Subtitle */}
                    <div>
                        <div
                            style={{
                                fontSize: 18,
                                fontWeight: 700,
                                color: '#0f172a',
                                letterSpacing: '-0.3px',
                            }}
                        >
                            {selectedMenu === 'dashboard' && 'Kanban Board & Dashboard'}
                            {selectedMenu === 'tasks' && 'Tugas Saya (My Tasks)'}
                            {selectedMenu === 'settings' && 'Pengaturan Akun & Sistem'}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                            {selectedMenu === 'dashboard' && 'Pantau dan kelola progres pekerjaan tim secara visual'}
                            {selectedMenu === 'tasks' && 'Daftar seluruh tugas yang ditugaskan kepada Anda'}
                            {selectedMenu === 'settings' && 'Konfigurasi akun dan preferensi aplikasi'}
                        </div>
                    </div>

                    {/* Right Section: Add Task Button + User Profile + Logout */}
                    <Space size={16} align="center">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="middle"
                            onClick={() => setCreateModalOpen(true)}
                            style={{
                                borderRadius: 6,
                                fontWeight: 600,
                                boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)',
                            }}
                        >
                            Tambah Tugas
                        </Button>

                        <div style={{ height: 28, width: 1, background: '#e2e8f0' }} />

                        {/* User Profile */}
                        <Space size={10} align="center">
                            <Avatar
                                size={36}
                                src={user?.image}
                                icon={<UserOutlined />}
                                style={{
                                    border: '1px solid #cbd5e1',
                                    background: '#e0f2fe',
                                    color: '#0284c7',
                                }}
                            />

                            <div style={{ lineHeight: 1.3, display: 'none', minWidth: 100 }} className="user-info-text">
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                                    {fullName}
                                </div>
                                <div style={{ fontSize: 11, color: '#64748b' }}>
                                    {user?.email || 'emily.johnson@x.dummyjson.com'}
                                </div>
                            </div>
                        </Space>

                        {/* Quick Logout Button */}
                        <Button
                            icon={<LogoutOutlined />}
                            danger
                            type="text"
                            onClick={handleLogout}
                            style={{
                                borderRadius: 6,
                                fontWeight: 500,
                            }}
                        >
                            Logout
                        </Button>
                    </Space>
                </Header>

                {/* Main Content Area */}
                <Content
                    style={{
                        padding: '24px',
                        overflowY: 'auto',
                        minHeight: 'calc(100vh - 68px)',
                    }}
                >
                    {/* View 1: Main Dashboard (Statistics + Filters + Kanban Board) */}
                    {selectedMenu === 'dashboard' && (
                        <div>
                            {/* Ringkasan Statistik Tugas */}
                            <DashboardStats />

                            {/* Search dan Filter Tugas */}
                            <TaskFilters />

                            {/* Kanban Board dengan Drag and Drop */}
                            <KanbanBoard />
                        </div>
                    )}

                    {/* View 2: My Tasks (Table view) */}
                    {selectedMenu === 'tasks' && <MyTasksView />}

                    {/* View 3: Settings */}
                    {selectedMenu === 'settings' && <SettingsView />}
                </Content>
            </Layout>

            {/* Global Quick Add Task Modal */}
            <TaskModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                defaultStatus="backlog"
            />
        </Layout>
    );
}
