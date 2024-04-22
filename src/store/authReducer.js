
import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = localStorage.getItem('authState')
  ? JSON.parse(localStorage.getItem('authState'))
  : {
      token: null,
      userId: null,
      isLoggedIn: false,
    };

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.isLoggedIn = true;
      localStorage.setItem('authState', JSON.stringify(state));

    },
    logout(state) {
      state.token = null;
      state.userId = null;
      state.isLoggedIn = false;
      localStorage.removeItem('authState');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
