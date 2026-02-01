import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, moveTaskOptimistic, updateTaskStatus, rollbackTaskMove, deleteTask } from '../../features/tasks/tasksSlice';
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import KanbanTask from './KanbanTask';
import { Toaster } from 'react-hot-toast';

const KanbanBoard = () => {
    const dispatch = useDispatch();
    const { items: tasks } = useSelector((state) => state.tasks);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const [activeTask, setActiveTask] = useState(null);

    const handleDragStart = (event) => {
        const { active } = event;
        const task = tasks.find(t => t.id === parseInt(active.id));
        setActiveTask(task);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const taskId = parseInt(active.id);
        const newStatus = over.id; // The column ID is the status

        const task = tasks.find(t => t.id === taskId);

        if (!task || task.status === newStatus) return;

        const previousStatus = task.status;

        // 1. Optimistic Update
        dispatch(moveTaskOptimistic({ taskId, newStatus }));

        // 2. API Call with Revert capability
        dispatch(updateTaskStatus({ taskId, status: newStatus, previousStatus, version: task.version }));
    };

    const columns = [
        { id: 'todo', title: 'To Do' },
        { id: 'in_progress', title: 'In Progress' },
        { id: 'review', title: 'Review' },
        { id: 'done', title: 'Done' }
    ];

    const [taskToDelete, setTaskToDelete] = useState(null);

    const checkDelete = (task) => {
        setTaskToDelete(task);
    };

    const confirmDelete = () => {
        if (taskToDelete) {
            dispatch(deleteTask(taskToDelete.id));
            setTaskToDelete(null);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div style={{
                display: 'flex',
                gap: '24px',
                overflowX: 'auto',
                flex: 1, // Take remaining vertical space
                minHeight: 0, // Allow shrinking for scroll
                paddingBottom: '20px'
            }}>
                {columns.map((col) => (
                    <KanbanColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        tasks={tasks.filter(t => t.status === col.id)}
                        onDeleteTask={checkDelete}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeTask ? <KanbanTask task={activeTask} isOverlay /> : null}
            </DragOverlay>

            <Toaster position="bottom-right" toastOptions={{
                style: {
                    background: '#333',
                    color: '#fff',
                }
            }} />

            {/* Delete Confirmation Modal */}
            {taskToDelete && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.5)', backpackFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'white', padding: '24px', borderRadius: '12px',
                        width: '100%', maxWidth: '400px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px', fontFamily: 'var(--font-display)' }}>Delete Task?</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
                            Are you sure you want to delete <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>"{taskToDelete.title}"</span>? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                                onClick={() => setTaskToDelete(null)}
                                style={{
                                    padding: '10px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                                    background: 'white', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 500
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{
                                    padding: '10px 16px', borderRadius: '8px', border: 'none',
                                    background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 600
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DndContext>
    );
};

export default KanbanBoard;
