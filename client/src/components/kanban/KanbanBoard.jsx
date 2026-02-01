import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, moveTaskOptimistic, updateTaskStatus, rollbackTaskMove } from '../../features/tasks/tasksSlice';
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
        </DndContext>
    );
};

export default KanbanBoard;
