import React, { useState } from 'react';
import { Input, Select, DatePicker, Button, Space, Card, Tag, Tooltip } from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    ReloadOutlined,
    CloseCircleOutlined,
    DownOutlined,
    UpOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Priority, Status } from '../../types';
import { DEFAULT_ASSIGNEES, useTaskStore } from '../../store/taskStore';

const { Option } = Select;

export const TaskFilters: React.FC = () => {
    const {
        filters,
        setSearch,
        setFilterPriority,
        setFilterAssignee,
        setFilterStatus,
        setFilterDueDate,
        resetFilters,
    } = useTaskStore();

    const [mobileExpanded, setMobileExpanded] = useState(false);

    // Hitung berapa banyak filter yang sedang aktif
    const activeFilterCount =
        (filters.search.trim() ? 1 : 0) +
        (filters.priority !== 'all' ? 1 : 0) +
        (filters.assignee !== 'all' ? 1 : 0) +
        (filters.status !== 'all' ? 1 : 0) +
        (filters.dueDate ? 1 : 0);

    return (
        <Card
            size="small"
            style={{
                marginBottom: 20,
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
            styles={{ body: { padding: '12px 14px' } }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                }}
            >
                {/* Search Row & Mobile Filter Toggle */}
                <div
                    style={{
                        display: 'flex',
                        gap: 10,
                        alignItems: 'center',
                    }}
                >
                    <div style={{ flex: 1 }}>
                        <Input
                            placeholder="Cari tugas berdasarkan judul atau deskripsi..."
                            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                            value={filters.search}
                            onChange={(e) => setSearch(e.target.value)}
                            allowClear
                            size="middle"
                            style={{ borderRadius: 6 }}
                        />
                    </div>

                    {/* Mobile Filter Toggle Button */}
                    <Button
                        className="mobile-only"
                        icon={<FilterOutlined />}
                        onClick={() => setMobileExpanded(!mobileExpanded)}
                        type={activeFilterCount > (filters.search ? 1 : 0) ? 'primary' : 'default'}
                        size="middle"
                        style={{ borderRadius: 6 }}
                    >
                        Filter {mobileExpanded ? <UpOutlined /> : <DownOutlined />}
                    </Button>
                </div>

                {/* Filter Controls (Always shown on desktop, collapsible on mobile) */}
                <div
                    style={{
                        display: mobileExpanded ? 'flex' : undefined,
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 8,
                    }}
                    className={!mobileExpanded ? 'desktop-flex' : undefined}
                >
                    {/* Priority Filter */}
                    <div style={{ flex: '1 1 120px', minWidth: 110 }}>
                        <Select<Priority | 'all'>
                            value={filters.priority}
                            onChange={(val) => setFilterPriority(val)}
                            style={{ width: '100%' }}
                            size="middle"
                            placeholder="Prioritas"
                        >
                            <Option value="all">Semua Prioritas</Option>
                            <Option value="high">High</Option>
                            <Option value="medium">Medium</Option>
                            <Option value="low">Low</Option>
                        </Select>
                    </div>

                    {/* Status Filter */}
                    <div style={{ flex: '1 1 120px', minWidth: 110 }}>
                        <Select<Status | 'all'>
                            value={filters.status}
                            onChange={(val) => setFilterStatus(val)}
                            style={{ width: '100%' }}
                            size="middle"
                            placeholder="Status"
                        >
                            <Option value="all">Semua Status</Option>
                            <Option value="backlog">Backlog</Option>
                            <Option value="todo">To Do</Option>
                            <Option value="in_progress">In Progress</Option>
                            <Option value="done">Done</Option>
                        </Select>
                    </div>

                    {/* Assignee Filter */}
                    <div style={{ flex: '1 1 140px', minWidth: 130 }}>
                        <Select<string>
                            value={filters.assignee}
                            onChange={(val) => setFilterAssignee(val)}
                            style={{ width: '100%' }}
                            size="middle"
                            placeholder="Assignee"
                        >
                            <Option value="all">Semua Assignee</Option>
                            {DEFAULT_ASSIGNEES.map((member) => (
                                <Option key={member.name} value={member.name}>
                                    {member.name}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    {/* Due Date Filter */}
                    <div style={{ flex: '1 1 130px', minWidth: 120 }}>
                        <DatePicker
                            placeholder="Filter Tenggat"
                            value={filters.dueDate ? dayjs(filters.dueDate) : null}
                            onChange={(date) =>
                                setFilterDueDate(date ? date.format('YYYY-MM-DD') : null)
                            }
                            style={{ width: '100%' }}
                            size="middle"
                            allowClear
                            format="YYYY-MM-DD"
                        />
                    </div>

                    {/* Reset Button */}
                    <div style={{ flex: '0 0 auto' }}>
                        {activeFilterCount > 0 ? (
                            <Button
                                icon={<CloseCircleOutlined />}
                                onClick={resetFilters}
                                danger
                                size="middle"
                                style={{ borderRadius: 6 }}
                            >
                                Reset ({activeFilterCount})
                            </Button>
                        ) : (
                            <Tooltip title="Reset semua filter">
                                <Button
                                    icon={<ReloadOutlined />}
                                    onClick={resetFilters}
                                    type="text"
                                    size="middle"
                                    style={{ color: '#94a3b8' }}
                                >
                                    Reset
                                </Button>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Filters Badges Indicator */}
            {activeFilterCount > 0 && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 6,
                        marginTop: 10,
                        paddingTop: 8,
                        borderTop: '1px dashed #f1f5f9',
                    }}
                >
                    <Space size={4}>
                        <FilterOutlined style={{ fontSize: 11, color: '#64748b' }} />
                        <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>
                            Aktif:
                        </span>
                    </Space>

                    {filters.search && (
                        <Tag
                            closable
                            onClose={() => setSearch('')}
                            color="blue"
                            style={{ fontSize: 11 }}
                        >
                            "{filters.search}"
                        </Tag>
                    )}

                    {filters.priority !== 'all' && (
                        <Tag
                            closable
                            onClose={() => setFilterPriority('all')}
                            color="orange"
                            style={{ fontSize: 11 }}
                        >
                            {filters.priority.toUpperCase()}
                        </Tag>
                    )}

                    {filters.assignee !== 'all' && (
                        <Tag
                            closable
                            onClose={() => setFilterAssignee('all')}
                            color="purple"
                            style={{ fontSize: 11 }}
                        >
                            {filters.assignee}
                        </Tag>
                    )}

                    {filters.status !== 'all' && (
                        <Tag
                            closable
                            onClose={() => setFilterStatus('all')}
                            color="cyan"
                            style={{ fontSize: 11 }}
                        >
                            {filters.status.replace('_', ' ').toUpperCase()}
                        </Tag>
                    )}

                    {filters.dueDate && (
                        <Tag
                            closable
                            onClose={() => setFilterDueDate(null)}
                            color="geekblue"
                            style={{ fontSize: 11 }}
                        >
                            {dayjs(filters.dueDate).format('DD MMM')}
                        </Tag>
                    )}
                </div>
            )}
        </Card>
    );
};
