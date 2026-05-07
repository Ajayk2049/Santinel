import { createSlice } from '@reduxjs/toolkit';

const getInitialToken = () => {
    const token = localStorage.getItem('token');
    if (token === 'null' || token === 'undefined') return null;
    return token || null;
};

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: getInitialToken(),
        user: null,
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
            if (action.payload) {
                localStorage.setItem('token', action.payload);
            } else {
                localStorage.removeItem('token');
            }
        },
        clearAuth: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('token');
        },
    },
});

export const { setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
