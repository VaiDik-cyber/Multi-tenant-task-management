import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Sparkles, CheckCircle, BarChart3 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(loginUser({ email, password }));
        if (loginUser.fulfilled.match(resultAction)) {
            navigate('/dashboard');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: '#ffffff', overflow: 'hidden' }}>
            {/* Left Side - Branding & Gradient */}
            <div style={{
                flex: 1,
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '60px',
                color: 'white',
                overflow: 'hidden'
            }}>
                {/* Abstract Shapes */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                    style={{
                        position: 'absolute', top: '-10%', right: '-10%',
                        width: '500px', height: '500px',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                        borderRadius: '50%'
                    }}
                />

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '24px', lineHeight: 1.1 }}>
                            TaskFlow
                        </h1>
                        <p style={{ fontSize: '1.2rem', lineHeight: 1.6, opacity: 0.9, maxWidth: '500px', marginBottom: '40px' }}>
                            A powerful, multi-tenant workspace for high-performance teams. Organize, track, and deliver with precision.
                        </p>
                    </motion.div>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                padding: '20px',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                minWidth: '140px'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <BarChart3 size={24} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Analytics</h3>
                            </div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Track team performance</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                padding: '20px',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                minWidth: '140px'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <CheckCircle size={24} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Kanban</h3>
                            </div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Visualize workflows</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                padding: '20px',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                minWidth: '140px'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Sparkles size={24} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Insights</h3>
                            </div>
                            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Smart recommendations</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                background: '#ffffff'
            }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>Sign In</h2>
                        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Enter your credentials to access your workspace.</p>
                    </div>

                    {status === 'failed' && (
                        <div style={{
                            background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444',
                            padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.9rem', textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '10px', background: '#4f46e5', borderColor: '#4f46e5' }}
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? 'Signing In...' : 'Sign In'}
                        </Button>
                    </form>

                    <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Don't have an account? <span style={{ color: '#4f46e5', fontWeight: 600, cursor: 'pointer' }}>Create one</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
