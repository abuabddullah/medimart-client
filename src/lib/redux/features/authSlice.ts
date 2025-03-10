import { IAuthState, IUserType } from "@/src/types/auth";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// const initialState: AuthState = {
const initialState: IAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      // action: PayloadAction<{ user: UserType; token: string }>
      action: PayloadAction<{ user: IUserType; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
    },
    // setUser: (state, action: PayloadAction<UserType>) => {
    setUser: (state, action: PayloadAction<IUserType>) => {
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
    },
  },
});

export const { setCredentials, setUser, setLoading, logout } =
  authSlice.actions;
export default authSlice.reducer;
