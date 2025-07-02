import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://mydoshbox-be.onrender.com/mediators';

// Login async thunk using native fetch
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ mediator_email, password }, thunkAPI) => {
      try {
        const response = await fetch(`${BASE_URL}/mediator-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mediator_email, password }), // 👈 Make sure this matches
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
  
        return data;
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;