import { useDroppable } from '@dnd-kit/core';
import KanbanTask from './KanbanTask';

const KanbanColumn = ({ id, title, tasks }) => {
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
        <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px',
                padding: '0 4px'
            }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: columnColors[id] || '#6366f1' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, fontFamily: 'var(--font-display)' }}>{title}</h3>
                <span style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '2px 8px', borderRadius: '12px',
                    fontSize: '0.75rem', color: 'var(--text-muted)'
                }}>
                    {tasks.length}
                </span>
            </div>

            <div
                ref={setNodeRef}
                style={{
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '16px',
                    padding: '16px',
                    flex: 1,
                    minHeight: '200px'
                }}
            >
                {tasks.map((task) => (
                    <KanbanTask key={task.id} task={task} />
                ))}
                {tasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'rgba(255,255,255,0.1)', fontSize: '0.9rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                        Drop here
                    </div>
                )}
            </div>
        </div>
    );
};

export default KanbanColumn;
