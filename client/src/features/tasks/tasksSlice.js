import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

// Async thunk to fetch tasks
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/tasks');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Failed to fetch tasks');
        }
    }
);

// Async thunk to update (persist) status
export const updateTaskStatus = createAsyncThunk(
    'tasks/updateTaskStatus',
    async ({ taskId, status, previousStatus, version }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/tasks/${taskId}/status`, { status, version });
            return { taskId, status, version: response.data.version }; // Update with new version from server
        } catch (error) {
            // Return necessary info to rollback
            return rejectWithValue({ taskId, previousStatus, error: error.response?.data?.error || 'Update failed' });
        }
    }
);

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        // Optimistic Update Reducer
        moveTaskOptimistic: (state, action) => {
            const { taskId, newStatus } = action.payload;
            const task = state.items.find((t) => t.id === taskId);
            if (task) {
                task.status = newStatus;
            }
        },
        // Rollback Reducer (called manually if async fails, or used in rejected case)
        rollbackTaskMove: (state, action) => {
            const { taskId, previousStatus } = action.payload;
            const task = state.items.find((t) => t.id === taskId);
            if (task) {
                task.status = previousStatus;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Tasks
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
                const { taskId, version } = action.payload;
                const task = state.items.find((t) => t.id === taskId);
                if (task) {
                    task.version = version; // Sync version from server
                }
            })
            .addCase(fetchTasks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                toast.error('Failed to load tasks');
            })
            // Update Status (Optimistic Handling)
            .addCase(updateTaskStatus.rejected, (state, action) => {
                const { taskId, previousStatus, error } = action.payload;
                // Rollback state
                const task = state.items.find((t) => t.id === taskId);
                if (task) {
                    task.status = previousStatus;
                }
                toast.error(`Update failed: ${error}`);
            });
    },
});

export const { moveTaskOptimistic, rollbackTaskMove } = tasksSlice.actions;
export default tasksSlice.reducer;
