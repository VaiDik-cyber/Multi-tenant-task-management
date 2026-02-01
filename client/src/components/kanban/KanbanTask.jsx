import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';

const KanbanTask = ({ task, isOverlay }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id.toString(),
        data: { task } // Pass task data for overlay
    });

    // If this is the original item being dragged, hide it or reduce opacity
    const style = {
        transform: transform ? CSS.Translate.toString(transform) : undefined,
        opacity: isDragging ? 0.3 : 1, // Ghost effect for original
        cursor: isOverlay ? 'grabbing' : 'grab',
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
                layoutId={isOverlay ? `overlay-${task.id}` : task.id}
                style={{
                    background: 'var(--bg-card)',
                    border: isOverlay ? '1px solid var(--primary)' : 'var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    // marginBottom: '12px', // Removed, using gap in column
                    boxShadow: isOverlay
                        ? '0 10px 20px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.1)' // Lifted effect
                        : 'var(--shadow-sm)',
                    scale: isOverlay ? 1.05 : 1, // Slight scaling when dragging
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.4 }}>{task.title}</h4>
                    <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        flexShrink: 0,
                        marginTop: '6px',
                        background: priorityColors[task.priority] || priorityColors.medium
                    }} />
                </div>

                {task.description && (
                    <p style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '16px',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {task.description}
                    </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto' }}>
                    {task.due_date && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '4px 8px', borderRadius: '6px' }}>
                            <Clock size={12} />
                            <span>{new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default KanbanTask;
