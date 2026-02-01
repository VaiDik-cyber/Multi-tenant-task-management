import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import KanbanBoard from '../components/kanban/KanbanBoard';
import api from '../api/axios';
import { Layers, Clock, CheckCircle, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <Card delay={delay} style={{
        background: 'var(--bg-card)',
        backdropFilter: 'var(--backdrop-blur)',
        border: 'var(--glass-border)',
        borderRadius: '20px',
        padding: '24px',
        display: 'flex', alignItems: 'center', gap: '20px'
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

    useEffect(() => {
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
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main style={{ marginLeft: '260px', flex: 1, padding: '40px' }}>

                {/* Header */}
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
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            {user?.username?.[0].toUpperCase() || 'A'}
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                    <StatCard
                        icon={CheckCircle}
                        label="Total Completed"
                        value={analytics?.tasksCompletedPerUser?.[0]?.completed_count || 0}
                        color="16, 185, 129" // Emerald
                        delay={0.1}
                    />
                    <StatCard
                        icon={Clock}
                        label="Avg Completion (Hrs)"
                        value={parseFloat(analytics?.avgCompletionTime || 0).toFixed(1)}
                        color="99, 102, 241" // Indigo
                        delay={0.2}
                    />
                    <StatCard
                        icon={Layers}
                        label="Overdue Tasks"
                        value={analytics?.overdueTasksCount || 0}
                        color="239, 68, 68" // Red
                        delay={0.3}
                    />
                </div>

                {/* Recent Activity Section */}
                <Card delay={0.4}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Analytics Overview</h3>
                        <BarChart3 size={20} color="var(--text-muted)" />
                    </div>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                        Chart visualization would go here
                    </div>
                </Card>

                {/* Kanban Board Section */}
                <div style={{ marginTop: '40px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px', fontFamily: 'var(--font-display)' }}>Task Board</h3>
                    <KanbanBoard />
                </div>

            </main>
        </div>
    );
};

export default Dashboard;
