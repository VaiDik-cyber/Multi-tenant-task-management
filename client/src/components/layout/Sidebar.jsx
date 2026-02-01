import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, LogOut, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    ];

    if (user?.role === 'admin') {
        menuItems.push({ icon: Users, label: 'Team', path: '/users' });
    }

    return (
        <div style={{
            width: '260px',
            background: '#0f172a', // Dark branding color
            borderRight: '1px solid #1e293b',
            height: '100vh',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0, top: 0,
            zIndex: 50,
            color: '#94a3b8'
        }}>
            <div style={{ padding: '0 12px 40px' }}>
                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    letterSpacing: '-0.5px'
                }}>
                    <div style={{
                        width: '32px', height: '32px',
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <div style={{ width: '12px', height: '12px', background: 'white', borderRadius: '50%', opacity: 0.9 }}></div>
                    </div>
                    TaskFlow
                </h2>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 12px 12px', color: '#64748b' }}>
                    Menu
                </div>
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <div
                            key={index}
                            onClick={() => navigate(item.path)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                color: isActive ? 'white' : '#94a3b8',
                                borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent',
                                fontWeight: isActive ? 500 : 400,
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            onMouseOver={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.color = '#e2e8f0';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#94a3b8';
                                }
                            }}
                        >
                            <item.icon size={20} style={{ opacity: isActive ? 1 : 0.7 }} />
                            <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
                        </div>
                    );
                })}
            </div>

            <div
                onClick={handleLogout}
                style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    marginTop: 'auto',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                    borderTop: '1px solid #1e293b'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.currentTarget.style.color = '#ef4444';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                }}
            >
                <LogOut size={20} />
                <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>Logout</span>
            </div>
        </div>
    );
};

export default Sidebar;
