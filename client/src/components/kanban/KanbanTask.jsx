import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';

const KanbanTask = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id.toString(),
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const priorityColors = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#ef4444',
        critical: '#7f1d1d'
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <motion.div
                layoutId={task.id}
                whileHover={{ scale: 1.02, boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}
                style={{
                    background: 'var(--bg-card)',
                    backdropFilter: 'var(--backdrop-blur)',
                    border: 'var(--glass-border)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '12px',
                    cursor: 'grab',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{task.title}</h4>
                    <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: priorityColors[task.priority] || priorityColors.medium
                    }} />
                </div>

                {task.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {task.description}
                    </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {task.due_date && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} />
                            <span>{new Date(task.due_date).toLocaleDateString()}</span>
                        </div>
                    )}
                    {task.status === 'review' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent)' }}>
                            <AlertCircle size={12} />
                            <span>Review</span>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default KanbanTask;
