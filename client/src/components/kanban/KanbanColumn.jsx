import { useDroppable } from '@dnd-kit/core';
import KanbanTask from './KanbanTask';

const KanbanColumn = ({ id, title, tasks, onDeleteTask }) => {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    const columnColors = {
        todo: '#6366f1',
        in_progress: '#f59e0b',
        review: '#ec4899',
        done: '#10b981'
    };

    return (
        <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 4px', marginBottom: '8px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: columnColors[id] || '#6366f1' }} /> */}
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h3>
                    <span style={{
                        background: 'var(--bg-hover)',
                        padding: '2px 8px', borderRadius: '12px',
                        fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)'
                    }}>
                        {tasks.length}
                    </span>
                </div>
            </div>

            {/* Droppable Area */}
            <div
                ref={setNodeRef}
                style={{
                    background: '#f1f5f9', // Slate 100 - Distinct contrast
                    borderRadius: 'var(--radius-lg)',
                    padding: '12px',
                    flex: 1,
                    minHeight: '150px',
                    border: '1px solid var(--border-subtle)',
                    borderTop: `3px solid ${columnColors[id] || '#6366f1'}`, // Colored indicator
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px', // Consistent spacing between cards
                    overflowY: 'auto'
                }}
            >
                {tasks.map((task) => (
                    <KanbanTask key={task.id} task={task} onDelete={onDeleteTask} />
                ))}

                {tasks.length === 0 && (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.85rem',
                        fontStyle: 'italic',
                        opacity: 0.7
                    }}>
                        No tasks
                    </div>
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;
