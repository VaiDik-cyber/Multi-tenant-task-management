import { useState, useEffect } from 'react';
import api from '../../api/axios';

const CreateTaskModal = ({ isOpen, onClose, user, onTaskCreated }) => {
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
    const [projects, setProjects] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    // Fetch projects and users on mount
    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                try {
                    const [projRes, usersRes] = await Promise.all([
                        api.get('/projects'),
                        api.get('/auth/users')
                    ]);

                    setProjects(projRes.data);
                    setUsersList(usersRes.data);

                    if (projRes.data.length > 0) {
                        setSelectedProjectId(projRes.data[0].id);
                    } else if (user?.role === 'admin') {
                        // Auto-create logic...
                        try {
                            const createRes = await api.post('/projects', { name: 'General', description: 'Auto-created default project' });
                            setProjects([createRes.data]);
                            setSelectedProjectId(createRes.data.id);
                        } catch (err) { console.error(err); }
                    }
                } catch (error) {
                    console.error('Failed to fetch data', error);
                }
            };
            fetchData();
        }
    }, [isOpen, user]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!selectedProjectId) {
            alert('No project available.');
            return;
        }

        try {
            await api.post('/tasks', {
                ...newTask,
                projectId: selectedProjectId,
                // If assigneeId is empty string from select, send null. defaulting to current user if not selected is OPTIONAL, 
                // but usually better to let them explicitly choose "Me" or "Someone else". 
                // Let's default to creating user if not specified? Or let select handle it.
                // The select value will be mapped to newTask state or a separate state.
                assigneeId: newTask.assigneeId || user?.id,
                dueDate: newTask.dueDate || null
            });
            // ... reset logic
            setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', assigneeId: '' });
            onClose();
            if (onTaskCreated) onTaskCreated();
            else window.location.reload();
        } catch (error) {
            alert('Failed to create task');
        }
    };

    if (!isOpen) return null;

    return (
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

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 500 }}>Assign To</label>
                        <select
                            value={newTask.assigneeId || ''}
                            onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white' }}
                        >
                            <option value="">Me ({user?.username})</option>
                            {usersList.filter(u => u.id !== user?.id).map(u => (
                                <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
                            ))}
                        </select>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '6px' }}>
                            ⓘ This task can be updated by <strong>Admins</strong>, the <strong>Creator</strong> (You), and the <strong>Assignee</strong>.
                        </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid #e2e8f0', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                        <button type="submit" style={{ padding: '10px 24px', borderRadius: '8px', background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Create Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
