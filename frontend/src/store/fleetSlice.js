import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5500';

export const fetchServices = createAsyncThunk('fleet/fetchServices', async (_, { getState }) => {
    const { auth } = getState();
    const url = `${API_BASE}/api/services/status`;
    console.log("Fetching fleet status from:", url, "Token present:", !!auth.token);
    const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${auth.token}` }
    });
    return response.data;
});

export const addService = createAsyncThunk('fleet/addService', async (serviceData, { getState }) => {
    const { auth } = getState();
    const url = `${API_BASE}/api/services`;
    const response = await axios.post(url, serviceData, {
        headers: { Authorization: `Bearer ${auth.token}` }
    });
    return response.data;
});

export const deleteService = createAsyncThunk('fleet/deleteService', async (id, { getState }) => {
    const { auth } = getState();
    const url = `${API_BASE}/api/services/${id}`;
    await axios.delete(url, {
        headers: { Authorization: `Bearer ${auth.token}` }
    });
    return id;
});

export const retryPing = createAsyncThunk('fleet/retryPing', async (id, { getState }) => {
    const { auth } = getState();
    const url = `${API_BASE}/api/services/${id}/retry`;
    await axios.post(url, {}, {
        headers: { Authorization: `Bearer ${auth.token}` }
    });
    return id;
});

export const updateService = createAsyncThunk('fleet/updateService', async ({ id, data }, { getState }) => {
    const { auth } = getState();
    const url = `${API_BASE}/api/services/${id}`;
    const response = await axios.put(url, data, {
        headers: { Authorization: `Bearer ${auth.token}` }
    });
    return response.data;
});

export const fetchIncidents = createAsyncThunk('fleet/fetchIncidents', async ({ id, page = 0, size = 10 }, { getState }) => {
    const { auth } = getState();
    const url = `${API_BASE}/api/services/${id}/incidents?page=${page}&size=${size}`;
    const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${auth.token}` }
    });
    return response.data;
});

const fleetSlice = createSlice({
    name: 'fleet',
    initialState: {
        services: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addService.fulfilled, (state, action) => {
                state.services.push(action.payload);
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.services = state.services.filter(s => s.id !== action.payload);
            })
            .addCase(updateService.fulfilled, (state, action) => {
                const index = state.services.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.services[index] = { ...state.services[index], ...action.payload };
                }
            });
    },
});

export default fleetSlice.reducer;
