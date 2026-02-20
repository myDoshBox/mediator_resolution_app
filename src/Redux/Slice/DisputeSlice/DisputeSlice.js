import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import backendURL from "../../../config";

// ─── Auth header helper — reads token from Redux state, NOT localStorage ──────
const authHeaders = (getState) => {
  const token = getState().auth.token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ─── Fetch all disputes for a mediator ───────────────────────────────────────
export const fetchAllDisputes = createAsyncThunk(
  "disputes/fetchAllDisputes",
  async (mediator_email, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(
        `${backendURL}/mediators/fetch-all-mediator-dispute/${mediator_email}`,
        {
          method: "GET",
          credentials: "include",
          headers: authHeaders(getState),
        },
      );
      const data = await response.json();
      if (!response.ok)
        return rejectWithValue(data.message || "Failed to fetch disputes");
      return data.data.disputes;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  },
);

// ─── Resolve a dispute ────────────────────────────────────────────────────────
export const resolveDispute = createAsyncThunk(
  "disputes/resolveDispute",
  async (
    { transaction_id, dispute_fault, resolution_description },
    { getState, rejectWithValue },
  ) => {
    try {
      const response = await fetch(
        `${backendURL}/mediators/resolve-dispute/${transaction_id}`,
        {
          method: "POST",
          credentials: "include",
          headers: authHeaders(getState),
          body: JSON.stringify({ dispute_fault, resolution_description }),
        },
      );
      const data = await response.json();
      if (!response.ok)
        return rejectWithValue(data.message || "Failed to resolve dispute");
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error");
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const disputeSlice = createSlice({
  name: "disputes",
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
      })
      // Patch resolved dispute in state immediately — no refetch needed
      .addCase(resolveDispute.fulfilled, (state, action) => {
        const resolved = action.payload?.data?.dispute;
        if (resolved) {
          const idx = state.disputes.findIndex((d) => d._id === resolved._id);
          if (idx !== -1)
            state.disputes[idx] = { ...state.disputes[idx], ...resolved };
        }
      });
  },
});

export default disputeSlice.reducer;
