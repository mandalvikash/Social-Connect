import { createSlice } from '@reduxjs/toolkit';

const getStoredUser = () => {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to parse stored user', error);
    return null;
  }
};

const initialState = {
  user: getStoredUser(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;