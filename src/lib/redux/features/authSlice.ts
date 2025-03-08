import { AuthState, UserType } from "@/src/types/auth";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Get initial state from localStorage if available
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
};

if (typeof window !== "undefined") {
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    initialState.token = storedToken;
    initialState.isAuthenticated = true;
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserType; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
    },
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  },
});

export const { setCredentials, setUser, setLoading, logout } =
  authSlice.actions;
export default authSlice.reducer;
