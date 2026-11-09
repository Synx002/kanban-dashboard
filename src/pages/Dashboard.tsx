import { useState } from 'react';
import { Layout, Menu, Avatar, Space, Button, message } from 'antd';
import {
    DashboardOutlined,
    UnorderedListOutlined,
    SettingOutlined,
    LogoutOutlined,
    UserOutlined,

} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const { Header, Sider, Content } = Layout;

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [collapsed, setCollapsed] = useState(false);

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
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
            onClick: handleLogout,
        },
    ];

    const fullName = user
        ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.username
        : 'User';

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Sidebar Navigation */}
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div
                    style={{
                        height: 32,
                        margin: 16,
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 6,
                        textAlign: 'center',
                        color: '#fff',
                        lineHeight: '32px',
                        fontWeight: 'bold',
                        letterSpacing: 1,
                    }}
                >
                    {collapsed ? 'TM' : 'TaskMaster'}
                </div>
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['dashboard']}
                    mode="inline"
                    items={menuItems}
                />
            </Sider>

            {/* Main Layout Area */}
            <Layout>
                {/* Header */}
                <Header
                    style={{
                        height: 72,
                        padding: '0 32px',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #f0f0f0',
                        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
                        lineHeight: 'normal',
                    }}
                >
                    {/* Left Section */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}>

                        <div>
                            <div style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: '#1f1f1f',
                                letterSpacing: '-0.3px',
                            }}>
                                Kanban Dashboard
                            </div>
                            <div style={{
                                fontSize: 11,
                                color: '#8c8c8c',
                                marginTop: 3,
                            }}>
                                Project Management
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <Space size={20} align="center">

                        {/* User Profile */}
                        <Space size={10} align="center">
                            <Avatar
                                size={40}
                                src={user?.image}
                                icon={<UserOutlined />}
                                style={{
                                    border: '2px solid #f0f0f0',
                                    background: '#e6f4ff',
                                    color: '#1677ff',
                                }}
                            />

                            <div style={{ lineHeight: 1.4 }}>
                                <div style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: '#262626',
                                }}>
                                    {fullName}
                                </div>

                                <div style={{
                                    fontSize: 12,
                                    color: '#8c8c8c',
                                }}>
                                    {user?.email}
                                </div>
                            </div>
                        </Space>

                        {/* Divider */}
                        <div style={{
                            height: 32,
                            width: 1,
                            background: '#f0f0f0',
                        }} />

                        {/* Logout */}
                        <Button
                            icon={<LogoutOutlined />}
                            danger
                            type="text"
                            onClick={handleLogout}
                            style={{
                                height: 38,
                                borderRadius: 8,
                                padding: '0 12px',
                                fontWeight: 500,
                                background: '#fff2f0',
                            }}
                        >
                            Logout
                        </Button>

                    </Space>
                </Header>

                {/* Content */}
                <Content style={{ margin: '0px 32px', background: '#fff', minHeight: 280, borderRadius: 8 }}>
                    <h2 style={{ marginBottom: 24 }}>Dashboard Overview</h2>


                </Content>
            </Layout>
        </Layout>
    );
}
