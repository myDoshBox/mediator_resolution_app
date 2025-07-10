// src/Redux/Slice/ResolveDisputeSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_URL = ' https://mydoshbox-be.vercel.app/';

export const resolveDispute = createAsyncThunk(
  'resolvedDisputes/resolveDispute',
  async ({ transaction_id, dispute_fault, resolution_description }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/mediators/resolve-dispute/${transaction_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dispute_fault, resolution_description }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to resolve dispute');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

const resolvedDisputeSlice = createSlice({
  name: 'resolvedDisputes',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
  .addCase(resolveDispute.pending, (state) => {
    state.loading = true;
    state.success = false;
    state.error = null;
  })
  .addCase(resolveDispute.fulfilled, (state, action) => {
    state.loading = false;
    state.success = true;
  })
  .addCase(resolveDispute.rejected, (state, action) => {
    state.loading = false;
    state.success = false;
    state.error = action.payload || 'An error occurred';
  });
  },
});

export default resolvedDisputeSlice.reducer;
