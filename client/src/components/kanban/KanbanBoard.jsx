import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, moveTaskOptimistic, updateTaskStatus, rollbackTaskMove } from '../../features/tasks/tasksSlice';
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
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

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return;

        const taskId = parseInt(active.id);
        const newStatus = over.id; // The column ID is the status

        const task = tasks.find(t => t.id === taskId);

        if (!task || task.status === newStatus) return;

        const previousStatus = task.status;

        // 1. Optimistic Update
        dispatch(moveTaskOptimistic({ taskId, newStatus }));

        // 2. API Call with Revert capability
        dispatch(updateTaskStatus({ taskId, status: newStatus, previousStatus }));
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
            onDragEnd={handleDragEnd}
        >
            <div style={{
                display: 'flex',
                gap: '24px',
                overflowX: 'auto',
                paddingBottom: '20px',
                height: 'calc(100vh - 120px)' // Adjust based on header
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
