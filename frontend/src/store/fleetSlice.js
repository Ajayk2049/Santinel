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
    console.log("Executing protocol add at:", url, "Data:", serviceData, "Token present:", !!auth.token);
    const response = await axios.post(url, serviceData, {
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
            .addCase(addService.rejected, (state, action) => {
                state.error = action.error.message;
                console.error("Add Service Failed:", action.error.message);
            });
    },
});

export default fleetSlice.reducer;
