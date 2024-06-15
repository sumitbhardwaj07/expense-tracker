import { createSlice } from "@reduxjs/toolkit";

const createDummyEmail = (email) => {
  if (!email) return '';
  return email
    .toLowerCase()
    .split("")
    .filter((e) => e.charCodeAt(0) >= 97 && e.charCodeAt(0) <= 122)
    .join("");
};


const initialAuthState = localStorage.getItem("authState")
  ? JSON.parse(localStorage.getItem("authState"))
  : {
      token: null,
      userId: null,
      isLoggedIn: false,
      showForgotPasswordModal: false,
      dummyEmail: '',
    };

// Create auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.dummyEmail = createDummyEmail(action.payload.email);
      state.isLoggedIn = true;
      localStorage.setItem("authState", JSON.stringify(state));
    },
    logout(state) {
      state.token = null;
      state.userId = null;
      state.isLoggedIn = false;
      localStorage.removeItem("authState");
    },
    showForgotPassword(state) {
      state.showForgotPasswordModal = true;
    },
    hideForgotPassword(state) {
      state.showForgotPasswordModal = false;
    },
    
  },
});

export const { login, logout, showForgotPassword, hideForgotPassword } = authSlice.actions;
export default authSlice.reducer;
