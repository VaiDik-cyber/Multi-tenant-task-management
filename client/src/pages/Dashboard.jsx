import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../components/layout/Layout';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import api from '../api/axios';
import { Layers, Clock, CheckCircle, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <Card delay={delay} style={{
        background: 'var(--bg-card)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        display: 'flex', alignItems: 'center', gap: '20px',
        boxShadow: 'var(--shadow-sm)'
    }}>
        <div style={{
            width: '56px', height: '56px',
            borderRadius: '16px',
            background: `rgba(${color}, 0.15)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: `rgb(${color})`
        }}>
            <Icon size={28} />
        </div>
        <div>
            <h3 style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{value}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>{label}</p>
        </div>
    </Card>
);

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // Task Form State
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });

    useEffect(() => {
        if (user?.role !== 'admin') {
            setLoading(false);
            return;
        }

        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/analytics');
                setAnalytics(response.data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [user]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', {
                ...newTask,
                projectId: 1, // Default
                assigneeId: user?.id,
                dueDate: newTask.dueDate || null
            });
            setIsTaskModalOpen(false);
            setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
            window.location.reload(); // Refresh to show new task
        } catch (error) {
            alert('Failed to create task');
        }
    };

    // ... (existing return logic)



    return (
        <Layout>
            {/* Header ... (Same) */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700 }}>
                        Dashboard
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.username || 'Admin'}</p>
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

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <StatCard
                    icon={CheckCircle}
                    label="Total Tasks"
                    value={analytics?.totalTasksCount || 0}
                    color="59, 130, 246"
                    delay={0}
                />
                <StatCard
                    icon={CheckCircle}
                    label="Completed"
                    value={analytics?.totalCompletedCount || 0}
                    color="16, 185, 129"
                    delay={0.1}
                />
                <StatCard
                    icon={Clock}
                    label="Avg Completion (Hrs)"
                    value={parseFloat(analytics?.avgCompletionTime || 0).toFixed(1)}
                    color="99, 102, 241"
                    delay={0.2}
                />
                <StatCard
                    icon={Layers}
                    label="Overdue Tasks"
                    value={analytics?.overdueTasksCount || 0}
                    color="239, 68, 68"
                    delay={0.3}
                />
            </div>

            {/* Recent Activity Section */}
            <Card delay={0.4}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Tasks by Status</h3>
                    <BarChart3 size={20} color="var(--text-muted)" />
                </div>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={[
                                { name: 'Todo', count: analytics?.tasksByStatus?.find(t => t.status === 'todo')?.count || 0, fill: '#6366f1' },
                                { name: 'In Progress', count: analytics?.tasksByStatus?.find(t => t.status === 'in_progress')?.count || 0, fill: '#f59e0b' },
                                { name: 'Review', count: analytics?.tasksByStatus?.find(t => t.status === 'review')?.count || 0, fill: '#ec4899' },
                                { name: 'Done', count: analytics?.tasksByStatus?.find(t => t.status === 'done')?.count || 0, fill: '#10b981' },
                            ]}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                            />
                            <Bar
                                dataKey="count"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Add Task Modal */}
            {isTaskModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ marginBottom: '16px', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Create New Task</h2>
                        <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Title</label>
                                <input
                                    placeholder="e.g. Redesign Homepage"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem' }}
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Description</label>
                                <textarea
                                    placeholder="Add details..."
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '80px', fontSize: '0.95rem' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Priority</label>
                                    <select
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white' }}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Due Date</label>
                                    <input
                                        type="date"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                                <button type="button" onClick={() => setIsTaskModalOpen(false)} style={{ padding: '10px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                                <button type="submit" style={{ padding: '10px 24px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Create Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
