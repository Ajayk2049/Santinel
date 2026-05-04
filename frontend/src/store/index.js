import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import fleetReducer from './fleetSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        fleet: fleetReducer,
    },
});
