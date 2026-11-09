import { useState } from 'react';
import { Layout, Menu, Avatar, Space, Button, Drawer, message } from 'antd';
import {
    DashboardOutlined,
    UnorderedListOutlined,
    SettingOutlined,
    LogoutOutlined,
    UserOutlined,
    PlusOutlined,
    MenuOutlined,
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
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
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
        },
    ];

    const fullName = user
        ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username
        : 'Emily Johnson';

    const handleMenuClick = (key: string) => {
        setSelectedMenu(key as 'dashboard' | 'tasks' | 'settings');
        setMobileDrawerOpen(false);
    };

    return (
        <Layout style={{ minHeight: '100vh', background: '#f1f5f9' }}>
            {/* Desktop Sidebar Navigation (Hidden on < 992px) */}
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                theme="dark"
                width={240}
                collapsedWidth={76}
                breakpoint="lg"
                className="desktop-only"
                style={{
                    background: '#111827',
                    boxShadow: '4px 0 20px rgba(0,0,0,0.06)',
                    borderRight: '1px solid #1f2937',
                    minHeight: '100vh',
                }}
            >
                {/* Brand / Logo */}
                <div
                    style={{
                        height: 68,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        padding: collapsed ? 0 : '0 20px',
                        gap: 12,
                        borderBottom: '1px solid #1f2937',
                    }}
                >
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            minWidth: 36,
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: 18,
                            fontWeight: 800,
                        }}
                    >
                        ✦
                    </div>

                    {!collapsed && (
                        <div>
                            <div
                                style={{
                                    fontSize: 16,
                                    fontWeight: 750,
                                    color: '#f9fafb',
                                    letterSpacing: '-0.4px',
                                    lineHeight: 1.2,
                                }}
                            >
                                TaskMaster
                            </div>
                            <div
                                style={{
                                    fontSize: 10,
                                    color: '#94a3b8',
                                    letterSpacing: '1px',
                                    fontWeight: 600,
                                }}
                            >
                                WORKSPACE
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Menu */}
                <Menu
                    theme="dark"
                    selectedKeys={[selectedMenu]}
                    mode="inline"
                    items={menuItems}
                    onClick={({ key }) => handleMenuClick(key)}
                    style={{
                        background: 'transparent',
                        borderRight: 0,
                        padding: collapsed ? '12px 6px' : '8px 10px',
                        fontSize: 13,
                        fontWeight: 500,
                    }}
                />

                {/* Bottom Logout Button */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: collapsed ? '12px 6px' : '16px 14px',
                        borderTop: '1px solid #1f2937',
                    }}
                >
                    <Button
                        icon={<LogoutOutlined />}
                        danger
                        type="text"
                        onClick={handleLogout}
                        block={!collapsed}
                        style={{
                            borderRadius: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            color: '#f87171',
                        }}
                    >
                        {!collapsed && <span>Logout</span>}
                    </Button>
                </div>
            </Sider>

            {/* Mobile Navigation Drawer */}
            <Drawer
                placement="left"
                open={mobileDrawerOpen}
                onClose={() => setMobileDrawerOpen(false)}
                width={260}
                styles={{
                    header: { display: 'none' },
                    body: {
                        padding: 0,
                        background: '#111827',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                    },
                }}
            >
                <div>
                    {/* Brand */}
                    <div
                        style={{
                            height: 64,
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 20px',
                            gap: 12,
                            borderBottom: '1px solid #1f2937',
                        }}
                    >
                        <div
                            style={{
                                width: 34,
                                height: 34,
                                borderRadius: 8,
                                background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
                                display: 'flex',
                                alignItems: 'center',
                                justifySelf: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: 16,
                                fontWeight: 800,
                            }}
                        >
                            ✦
                        </div>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>
                                TaskMaster
                            </div>
                            <div style={{ fontSize: 10, color: '#94a3b8' }}>Workspace Mobile</div>
                        </div>
                    </div>

                    {/* Menu */}
                    <Menu
                        theme="dark"
                        selectedKeys={[selectedMenu]}
                        mode="inline"
                        items={menuItems}
                        onClick={({ key }) => handleMenuClick(key)}
                        style={{
                            background: 'transparent',
                            padding: '12px 10px',
                            fontSize: 14,
                        }}
                    />
                </div>

                {/* User & Logout in Drawer */}
                <div style={{ padding: '16px', borderTop: '1px solid #1f2937', background: '#0f172a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <Avatar src={user?.image} icon={<UserOutlined />} size={36} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9' }} className="truncate">
                                {fullName}
                            </div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }} className="truncate">
                                {user?.email}
                            </div>
                        </div>
                    </div>

                    <Button
                        icon={<LogoutOutlined />}
                        block
                        danger
                        onClick={handleLogout}
                        style={{
                            height: 38,
                            borderRadius: 8,
                            background: 'rgba(239, 68, 68, 0.10)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: '#fca5a5',
                            fontWeight: 500,
                            boxShadow: 'none',
                        }}
                    >
                        Keluar (Logout)
                    </Button>
                </div>
            </Drawer>

            {/* Main Layout Area */}
            <Layout style={{ background: '#f8fafc', minWidth: 0 }}>
                {/* Header */}
                <Header
                    style={{
                        height: 64,
                        padding: '0 16px',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #e2e8f0',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                        lineHeight: 'normal',
                    }}
                >
                    {/* Left: Mobile Menu Trigger + Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <Button
                            className="mobile-only"
                            type="text"
                            icon={<MenuOutlined style={{ fontSize: 18 }} />}
                            onClick={() => setMobileDrawerOpen(true)}
                            style={{ padding: '4px 8px' }}
                        />

                        <div style={{ minWidth: 0 }}>
                            <div
                                style={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: '#0f172a',
                                    letterSpacing: '-0.3px',
                                }}
                                className="truncate"
                            >
                                {selectedMenu === 'dashboard' && 'Kanban Board'}
                                {selectedMenu === 'tasks' && 'Tugas Saya'}
                                {selectedMenu === 'settings' && 'Pengaturan'}
                            </div>
                            <div
                                style={{ fontSize: 11, color: '#64748b' }}
                                className="desktop-only truncate"
                            >
                                {selectedMenu === 'dashboard' && 'Pantau dan kelola progres pekerjaan secara visual'}
                                {selectedMenu === 'tasks' && 'Daftar seluruh tugas yang ditugaskan kepada Anda'}
                                {selectedMenu === 'settings' && 'Konfigurasi akun dan preferensi data'}
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick Add Task + User Profile */}
                    <Space size={10} align="center">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="middle"
                            onClick={() => setCreateModalOpen(true)}
                            style={{
                                borderRadius: 6,
                                fontWeight: 600,
                            }}
                        >
                            <span className="desktop-only">Tambah Tugas</span>
                        </Button>

                        <div className="desktop-only" style={{ height: 24, width: 1, background: '#e2e8f0' }} />

                        {/* User Profile */}
                        <Space size={8} align="center">
                            <Avatar
                                size={32}
                                src={user?.image}
                                icon={<UserOutlined />}
                                style={{
                                    border: '1px solid #cbd5e1',
                                    background: '#e0f2fe',
                                    color: '#0284c7',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setSelectedMenu('settings')}
                            />

                            <div style={{ lineHeight: 1.2, minWidth: 80 }} className="desktop-only">
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>
                                    {fullName.split(' ')[0]}
                                </div>
                                <div style={{ fontSize: 10, color: '#64748b' }}>
                                    {user?.username || 'user'}
                                </div>
                            </div>
                        </Space>

                        {/* Desktop Logout Button */}
                        <Button
                            className="desktop-only"
                            icon={<LogoutOutlined />}
                            danger
                            type="text"
                            onClick={handleLogout}
                            style={{
                                borderRadius: 6,
                                padding: '0 8px',
                            }}
                        >
                            Logout
                        </Button>
                    </Space>
                </Header>

                {/* Main Content Area */}
                <Content
                    className="dashboard-content-container"
                    style={{
                        overflowY: 'auto',
                        minHeight: 'calc(100vh - 64px)',
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
