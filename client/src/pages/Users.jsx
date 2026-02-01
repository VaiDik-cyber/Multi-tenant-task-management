import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser } from '../features/users/usersSlice';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Shield, Trash2, Search, Filter } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';
import Layout from '../components/layout/Layout';

const Users = () => {
    const dispatch = useDispatch();
    const { users, isLoading } = useSelector((state) => state.users);
    const { user: currentUser } = useSelector((state) => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createUser(formData)).unwrap();
            setIsModalOpen(false);
            setFormData({ username: '', email: '', password: '', role: 'user' });
        } catch (error) {
            // Toast handled in slice
        }
    };

    const getRoleBadge = (role) => {
        const styles = {
            admin: { bg: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5' },
            user: { bg: '#dcfce7', color: '#16a34a', border: '1px solid #86efac' }
        };
        const style = styles[role] || styles.user;

        return (
            <span style={{
                background: style.bg,
                color: style.color,
                border: style.border,
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {role}
            </span>
        );
    };

    return (
        <Layout>
            <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Team Members</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Manage access and roles for your organization.</p>
                    </div>
                    <Button variant="primary" onClick={() => setIsModalOpen(true)} style={{ gap: '8px' }}>
                        <UserPlus size={18} />
                        Add Member
                    </Button>
                </div>

                {/* Users Table */}
                <Card className="no-padding" style={{ overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: 'var(--bg-hover)', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>User</th>
                                    <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Email</th>
                                    <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Role</th>
                                    <th style={{ padding: '16px 24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Joined</th>
                                    <th style={{ padding: '16px 24px', textAlign: 'right' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            No users found. Add your first team member!
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u) => (
                                        <motion.tr
                                            key={u.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            style={{ borderBottom: '1px solid var(--border-subtle)' }}
                                            whileHover={{ background: 'var(--bg-main)' }}
                                        >
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '40px', height: '40px', borderRadius: '50%',
                                                        background: 'var(--primary-light)', color: 'var(--primary)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontWeight: 600
                                                    }}>
                                                        {u.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{u.username}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{u.email}</td>
                                            <td style={{ padding: '16px 24px' }}>{getRoleBadge(u.role)}</td>
                                            <td style={{ padding: '16px 24px', color: 'var(--text-muted)' }}>
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                                {/* Actions could go here (Edit/Delete) - strictly MVP for now */}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Add User Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Add Team Member"
                >
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Input
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="e.g. john_doe"
                            icon={User}
                        />
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@company.com"
                            icon={Mail}
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            icon={Shield}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                style={{
                                    padding: '10px 12px',
                                    borderRadius: 'var(--radius-md)',
                                    border: 'var(--border-subtle)',
                                    background: 'var(--bg-card)',
                                    fontSize: '0.95rem',
                                    color: 'var(--text-main)',
                                    outline: 'none'
                                }}
                            >
                                <option value="user">Member (Standard Access)</option>
                                <option value="admin">Admin (Full Access)</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" variant="primary" disabled={isLoading}>
                                {isLoading ? 'Adding...' : 'Add Member'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
};

export default Users;
