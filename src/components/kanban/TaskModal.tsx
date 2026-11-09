import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Avatar, Space, Row, Col, message } from 'antd';
import dayjs from 'dayjs';
import type { Priority, Status, Task } from '../../types';
import { DEFAULT_ASSIGNEES, useTaskStore } from '../../store/taskStore';

const { TextArea } = Input;
const { Option } = Select;

interface TaskModalProps {
    open: boolean;
    onClose: () => void;
    editingTask?: Task | null;
    defaultStatus?: Status;
}

interface FormValues {
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    dueDate: dayjs.Dayjs;
    assignee?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
    open,
    onClose,
    editingTask,
    defaultStatus = 'backlog',
}) => {
    const [form] = Form.useForm<FormValues>();
    const { addTask, updateTask } = useTaskStore();
    const isEditing = !!editingTask;

    useEffect(() => {
        if (open) {
            if (editingTask) {
                form.setFieldsValue({
                    title: editingTask.title,
                    description: editingTask.description,
                    priority: editingTask.priority,
                    status: editingTask.status,
                    dueDate: editingTask.dueDate ? dayjs(editingTask.dueDate) : dayjs(),
                    assignee: editingTask.assignee || undefined,
                });
            } else {
                form.resetFields();
                form.setFieldsValue({
                    priority: 'medium',
                    status: defaultStatus,
                    dueDate: dayjs().add(3, 'day'),
                });
            }
        }
    }, [open, editingTask, defaultStatus, form]);

    const handleFinish = (values: FormValues) => {
        const formattedDueDate = values.dueDate.format('YYYY-MM-DD');

        if (isEditing && editingTask) {
            updateTask(editingTask.id, {
                title: values.title.trim(),
                description: values.description.trim(),
                priority: values.priority,
                status: values.status,
                dueDate: formattedDueDate,
                assignee: values.assignee,
            });
            message.success('Tugas berhasil diperbarui!');
        } else {
            addTask({
                title: values.title.trim(),
                description: values.description.trim(),
                priority: values.priority,
                status: values.status,
                dueDate: formattedDueDate,
                assignee: values.assignee,
            });
            message.success('Tugas baru berhasil ditambahkan!');
        }

        onClose();
    };

    return (
        <Modal
            title={isEditing ? 'Edit Tugas' : 'Tambah Tugas Baru'}
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            okText={isEditing ? 'Simpan Perubahan' : 'Buat Tugas'}
            cancelText="Batal"
            destroyOnClose
            style={{ maxWidth: 'calc(100vw - 24px)', top: 20 }}
            width={520}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                style={{ marginTop: 16 }}
            >
                {/* Title */}
                <Form.Item
                    label="Judul Tugas"
                    name="title"
                    rules={[
                        { required: true, message: 'Judul tugas wajib diisi!' },
                        { min: 3, message: 'Judul minimal 3 karakter!' },
                    ]}
                >
                    <Input placeholder="Contoh: Implementasi Sistem Pembayaran" maxLength={100} showCount />
                </Form.Item>

                {/* Description */}
                <Form.Item
                    label="Deskripsi Tugas"
                    name="description"
                    rules={[{ required: true, message: 'Deskripsi tugas wajib diisi!' }]}
                >
                    <TextArea
                        rows={3}
                        placeholder="Jelaskan detail pekerjaan atau catatan penting..."
                        maxLength={500}
                        showCount
                    />
                </Form.Item>

                {/* Priority & Status - Responsive Grid */}
                <Row gutter={[16, 0]}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Prioritas"
                            name="priority"
                            rules={[{ required: true, message: 'Pilih prioritas tugas!' }]}
                        >
                            <Select placeholder="Pilih prioritas">
                                <Option value="high">
                                    <span style={{ color: '#ff4d4f', fontWeight: 600 }}>● HIGH</span>
                                </Option>
                                <Option value="medium">
                                    <span style={{ color: '#fa8c16', fontWeight: 600 }}>● MEDIUM</span>
                                </Option>
                                <Option value="low">
                                    <span style={{ color: '#52c41a', fontWeight: 600 }}>● LOW</span>
                                </Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[{ required: true, message: 'Pilih status tugas!' }]}
                        >
                            <Select placeholder="Pilih status">
                                <Option value="backlog">Backlog</Option>
                                <Option value="todo">To Do</Option>
                                <Option value="in_progress">In Progress</Option>
                                <Option value="done">Done</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Due Date & Assignee - Responsive Grid */}
                <Row gutter={[16, 0]}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Tenggat Waktu (Due Date)"
                            name="dueDate"
                            rules={[{ required: true, message: 'Tenggat waktu wajib dipilih!' }]}
                        >
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item label="Assignee (Penanggung Jawab)" name="assignee">
                            <Select placeholder="Pilih assignee (opsional)" allowClear>
                                {DEFAULT_ASSIGNEES.map((member) => (
                                    <Option key={member.name} value={member.name}>
                                        <Space size={6}>
                                            <Avatar size={20} src={member.avatar} />
                                            <span>{member.name}</span>
                                        </Space>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
