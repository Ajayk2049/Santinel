import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../lib/axiosInstance';

export const fetchServices = createAsyncThunk('fleet/fetchServices', async () => {
    const url = `/api/services/status`;
    const response = await axiosInstance.get(url);
    return response.data;
});

export const addService = createAsyncThunk('fleet/addService', async (serviceData) => {
    const url = `/api/services`;
    const response = await axiosInstance.post(url, serviceData);
    return response.data;
});

export const deleteService = createAsyncThunk('fleet/deleteService', async (id) => {
    const url = `/api/services/${id}`;
    await axiosInstance.delete(url);
    return id;
});

export const retryPing = createAsyncThunk('fleet/retryPing', async (id) => {
    const url = `/api/services/${id}/retry`;
    await axiosInstance.post(url, {});
    return id;
});

export const updateService = createAsyncThunk('fleet/updateService', async ({ id, data }) => {
    const url = `/api/services/${id}`;
    const response = await axiosInstance.put(url, data);
    return response.data;
});

export const fetchIncidents = createAsyncThunk('fleet/fetchIncidents', async ({ id, page = 0, size = 10 }) => {
    const url = `/api/services/${id}/incidents?page=${page}&size=${size}`;
    const response = await axiosInstance.get(url);
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
