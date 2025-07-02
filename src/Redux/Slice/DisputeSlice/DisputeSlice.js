import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAllDisputes = createAsyncThunk(
  'disputes/fetchAllDisputes',
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/disputes', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Failed to fetch disputes');
      }

      return data.disputes; // adjust based on your API response structure
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const disputeSlice = createSlice({
  name: 'disputes',
  initialState: {
    disputes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDisputes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDisputes.fulfilled, (state, action) => {
        state.loading = false;
        state.disputes = action.payload;
      })
      .addCase(fetchAllDisputes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default disputeSlice.reducer;
