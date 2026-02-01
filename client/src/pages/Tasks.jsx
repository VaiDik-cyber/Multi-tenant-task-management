import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Layout from '../components/layout/Layout';
import KanbanBoard from '../components/kanban/KanbanBoard';
import CreateTaskModal from '../components/tasks/CreateTaskModal';

const Tasks = () => {
    const { user } = useSelector((state) => state.auth);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => setIsTaskModalOpen(true)}
                        style={{
                            padding: '10px 16px',
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        <span>+ New Task</span>
                    </button>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {user?.username?.[0].toUpperCase() || 'A'}
                    </div>
                </div>
            </motion.div>

            {/* Kanban Board */}
            <KanbanBoard />

            {/* Create Task Modal */}
            <CreateTaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                user={user}
            />
        </Layout>
    );
};

export default Tasks;
