import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Settings, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: CheckSquare, label: 'Tasks', active: false },
        { icon: Settings, label: 'Settings', active: false },
    ];

    return (
        <div style={{
            width: '260px',
            background: 'rgba(15, 16, 22, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRight: 'var(--glass-border)',
            height: '100vh',
            padding: '30px 20px',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0, top: 0
        }}>
            <div style={{ padding: '0 10px 40px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}>
                    Task<span style={{ color: 'var(--primary)' }}>Flow</span>
                </h2>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            background: item.active ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.1), transparent)' : 'transparent',
                            borderLeft: item.active ? '3px solid var(--primary)' : '3px solid transparent',
                            color: item.active ? 'var(--text-main)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <item.icon size={20} color={item.active ? 'var(--primary)' : 'currentColor'} />
                        <span style={{ fontWeight: 500 }}>{item.label}</span>
                    </div>
                ))}
            </div>

            <div
                onClick={handleLogout}
                style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    marginTop: 'auto'
                }}
            >
                <LogOut size={20} />
                <span style={{ fontWeight: 500 }}>Logout</span>
            </div>
        </div>
    );
};

export default Sidebar;
