import { createSlice } from '@reduxjs/toolkit';

const fleetSlice = createSlice({
    name: 'fleet',
    initialState: {
        services: [],
        loading: false,
        error: null,
    },
    reducers: {
        setServices: (state, action) => {
            state.services = action.payload;
        },
        updateServiceStatus: (state, action) => {
            const index = state.services.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.services[index] = { ...state.services[index], ...action.payload };
            }
        },
    },
});

export const { setServices, updateServiceStatus } = fleetSlice.actions;
export default fleetSlice.reducer;
