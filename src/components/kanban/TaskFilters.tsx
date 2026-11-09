import React from 'react';
import { Input, Select, DatePicker, Button, Space, Card, Tag, Tooltip } from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    ReloadOutlined,
    CloseCircleOutlined,
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
            styles={{ body: { padding: '12px 16px' } }}
        >
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                }}
            >
                {/* Search Input */}
                <div style={{ flex: '1 1 240px', minWidth: 220 }}>
                    <Input
                        placeholder="Cari tugas berdasarkan judul atau deskripsi..."
                        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                        value={filters.search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                        size="middle"
                    />
                </div>

                {/* Filter Controls */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 10,
                    }}
                >
                    {/* Priority Filter */}
                    <Select<Priority | 'all'>
                        value={filters.priority}
                        onChange={(val) => setFilterPriority(val)}
                        style={{ width: 130 }}
                        size="middle"
                        placeholder="Prioritas"
                    >
                        <Option value="all">Semua Prioritas</Option>
                        <Option value="high">High</Option>
                        <Option value="medium">Medium</Option>
                        <Option value="low">Low</Option>
                    </Select>

                    {/* Assignee Filter */}
                    <Select<string>
                        value={filters.assignee}
                        onChange={(val) => setFilterAssignee(val)}
                        style={{ width: 160 }}
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

                    {/* Status Filter */}
                    <Select<Status | 'all'>
                        value={filters.status}
                        onChange={(val) => setFilterStatus(val)}
                        style={{ width: 130 }}
                        size="middle"
                        placeholder="Status"
                    >
                        <Option value="all">Semua Status</Option>
                        <Option value="backlog">Backlog</Option>
                        <Option value="todo">To Do</Option>
                        <Option value="in_progress">In Progress</Option>
                        <Option value="done">Done</Option>
                    </Select>

                    {/* Due Date Filter */}
                    <DatePicker
                        placeholder="Filter Due Date"
                        value={filters.dueDate ? dayjs(filters.dueDate) : null}
                        onChange={(date) =>
                            setFilterDueDate(date ? date.format('YYYY-MM-DD') : null)
                        }
                        style={{ width: 150 }}
                        size="middle"
                        allowClear
                        format="YYYY-MM-DD"
                    />

                    {/* Reset Button */}
                    {activeFilterCount > 0 ? (
                        <Button
                            icon={<CloseCircleOutlined />}
                            onClick={resetFilters}
                            danger
                            size="middle"
                        >
                            Reset Filter ({activeFilterCount})
                        </Button>
                    ) : (
                        <Tooltip title="Reset semua filter ke default">
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
                        <FilterOutlined style={{ fontSize: 12, color: '#64748b' }} />
                        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                            Filter Aktif:
                        </span>
                    </Space>

                    {filters.search && (
                        <Tag
                            closable
                            onClose={() => setSearch('')}
                            color="blue"
                        >
                            Pencarian: "{filters.search}"
                        </Tag>
                    )}

                    {filters.priority !== 'all' && (
                        <Tag
                            closable
                            onClose={() => setFilterPriority('all')}
                            color="orange"
                        >
                            Prioritas: {filters.priority.toUpperCase()}
                        </Tag>
                    )}

                    {filters.assignee !== 'all' && (
                        <Tag
                            closable
                            onClose={() => setFilterAssignee('all')}
                            color="purple"
                        >
                            Assignee: {filters.assignee}
                        </Tag>
                    )}

                    {filters.status !== 'all' && (
                        <Tag
                            closable
                            onClose={() => setFilterStatus('all')}
                            color="cyan"
                        >
                            Status: {filters.status.replace('_', ' ').toUpperCase()}
                        </Tag>
                    )}

                    {filters.dueDate && (
                        <Tag
                            closable
                            onClose={() => setFilterDueDate(null)}
                            color="geekblue"
                        >
                            Tenggat: {dayjs(filters.dueDate).format('DD MMM YYYY')}
                        </Tag>
                    )}
                </div>
            )}
        </Card>
    );
};

