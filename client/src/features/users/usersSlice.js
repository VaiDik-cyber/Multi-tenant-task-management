import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = 'http://localhost:3000/auth/users';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const createUser = createAsyncThunk('users/createUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(API_URL, userData, getAuthHeaders());
        toast.success('User created successfully!');
        return response.data;
    } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to create user');
        return rejectWithValue(error.response.data);
    }
});

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.error || 'Failed to fetch users';
            })
            // Create User
            .addCase(createUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.isLoading = false;
                // Add new user to list, assume response returns formatted user or just refetch
                // The backend returns { message, userId, username, email, role }
                const newUser = {
                    id: action.payload.userId,
                    username: action.payload.username,
                    email: action.payload.email,
                    role: action.payload.role,
                    created_at: new Date().toISOString()
                };
                state.users.unshift(newUser);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.error || 'Failed to create user';
            });
    },
});

export default usersSlice.reducer;
