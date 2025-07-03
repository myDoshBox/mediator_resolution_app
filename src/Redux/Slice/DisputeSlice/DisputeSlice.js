import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// export const fetchMediatorDisputes = createAsyncThunk(
//   'disputes/fetchMediatorDisputes',
//   async (_, thunkAPI) => {
//     try {
//       const response = await fetch('https://mydoshbox-be.onrender.com/mediators/fetch-all-mediator-dispute/muoghaluchidinma@gmail.com');
//       const data = await response.json();
//       return data.data.disputes;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   } 
// );


// ✅ Async thunk to fetch disputes
export const fetchAllDisputes = createAsyncThunk(
  'disputes/fetchAllDisputes',
  async (mediator_email, thunkAPI) => {
    try {
      const response = await fetch(`https://mydoshbox-be.onrender.com/mediators/fetch-all-mediator-dispute/${mediator_email}`);

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || 'Failed to fetch disputes');
      }

      return data.data.disputes; // Make sure this matches your API structure
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
