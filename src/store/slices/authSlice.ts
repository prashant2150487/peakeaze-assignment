import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  email: string;
  role: string;
  permissions: string[];
  createdAt: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string; refreshToken?: string }>
    ) => {
      const newState = state;
      newState.user = action.payload.user;
      newState.token = action.payload.token;
      if (action.payload.refreshToken) {
        newState.refreshToken = action.payload.refreshToken;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
      newState.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
      return newState;
    },
    setUser: (state, action: PayloadAction<User>) => {
      const newState = state;
      newState.user = action.payload;
      return newState;
    },
    logout: (state) => {
      const newState = state;
      newState.user = null;
      newState.token = null;
      newState.refreshToken = null;
      newState.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return newState;
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
