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
            background: 'var(--bg-sidebar)',
            borderRight: 'var(--border-subtle)',
            height: '100vh',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0, top: 0,
            zIndex: 50
        }}>
            <div style={{ padding: '0 12px 32px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', background: 'var(--primary)', borderRadius: '6px' }}></div>
                    TaskFlow
                </h2>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                                padding: '10px 12px',
                                borderRadius: 'var(--radius-md)',
                                background: isActive ? 'var(--primary-light)' : 'transparent',
                                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                fontWeight: isActive ? 600 : 500,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                            }}
                            onMouseOver={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'var(--bg-hover)';
                                    e.currentTarget.style.color = 'var(--text-main)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                }
                            }}
                        >
                            <item.icon size={18} />
                            <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
                        </div>
                    );
                })}
            </div>

            <div
                onClick={handleLogout}
                style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 12px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    marginTop: 'auto',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = '#fef2f2';
                    e.currentTarget.style.color = 'var(--danger)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                }}
            >
                <LogOut size={18} />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Logout</span>
            </div>
        </div>
    );
};

export default Sidebar;
