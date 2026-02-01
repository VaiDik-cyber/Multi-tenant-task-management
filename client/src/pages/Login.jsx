import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Sparkles } from 'lucide-react';

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
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Orbs */}
            <motion.div
                animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
                transition={{ duration: 20, repeat: Infinity }}
                style={{
                    position: 'absolute', top: '10%', left: '10%',
                    width: '300px', height: '300px',
                    background: 'var(--primary)',
                    filter: 'blur(150px)',
                    opacity: 0.3,
                    zIndex: -1
                }}
            />
            <motion.div
                animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
                transition={{ duration: 15, repeat: Infinity, delay: 2 }}
                style={{
                    position: 'absolute', bottom: '10%', right: '10%',
                    width: '400px', height: '400px',
                    background: 'var(--accent)',
                    filter: 'blur(180px)',
                    opacity: 0.2,
                    zIndex: -1
                }}
            />

            {/* Glass Card */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                    background: 'var(--bg-card)',
                    backdropFilter: 'var(--backdrop-blur)',
                    border: 'var(--glass-border)',
                    padding: '40px',
                    borderRadius: '24px',
                    width: '100%',
                    maxWidth: '420px',
                    boxShadow: 'var(--glass-shadow)',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <motion.div
                        initial={{ rotate: -180, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        style={{
                            width: '60px', height: '60px',
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            borderRadius: '16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                            boxShadow: '0 10px 30px var(--primary-glow)'
                        }}
                    >
                        <Sparkles size={32} color="white" />
                    </motion.div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '8px' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Sign in to manage your tasks</p>
                </div>

                {status === 'failed' && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="admin@testorg.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        className="w-full"
                        style={{ width: '100%', marginTop: '10px' }}
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Authenticating...' : 'Sign In'}
                    </Button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <span style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Contact Admin</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
