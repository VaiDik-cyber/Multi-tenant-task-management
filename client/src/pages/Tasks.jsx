import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import api from '../api/axios';
import Layout from '../components/layout/Layout';
import KanbanBoard from '../components/kanban/KanbanBoard';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Tasks = () => {
    const { user } = useSelector((state) => state.auth);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', {
                ...newTask,
                projectId: 1, // Default
                assigneeId: user?.id
            });
            setIsTaskModalOpen(false);
            setNewTask({ title: '', description: '', priority: 'medium' });
            window.location.reload(); // Refresh to show new task
        } catch (error) {
            alert('Failed to create task');
        }
    };

    return (
        <Layout style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', padding: '40px' }}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700 }}>
                        Tasks
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your project tasks</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setIsTaskModalOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
                >
                    <Plus size={18} strokeWidth={2.5} />
                    <span>New Task</span>
                </Button>
            </motion.div>

            {/* Kanban Board */}
            <KanbanBoard />

            {/* Create Task Modal */}
            <Modal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                title="Create New Task"
            >
                <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Title</label>
                        <Input
                            placeholder="e.g. Redesign Homepage"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Description</label>
                        <textarea
                            placeholder="Add details..."
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: 'var(--radius-md)',
                                border: 'var(--border-subtle)',
                                background: 'var(--bg-card)',
                                color: 'var(--text-main)',
                                fontSize: '0.95rem',
                                minHeight: '100px',
                                resize: 'vertical',
                                outline: 'none',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Priority</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {['low', 'medium', 'high', 'critical'].map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setNewTask({ ...newTask, priority: p })}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: newTask.priority === p ? `1px solid var(--primary)` : '1px solid rgba(0,0,0,0.1)',
                                        background: newTask.priority === p ? 'var(--primary-light)' : 'transparent',
                                        color: newTask.priority === p ? 'var(--primary)' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        textTransform: 'capitalize',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                        <Button type="button" variant="ghost" onClick={() => setIsTaskModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Create Task
                        </Button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default Tasks;
