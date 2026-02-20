import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import backendURL from "../../../config";

// ─── Login ────────────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ mediator_email, password }, thunkAPI) => {
    try {
      const response = await fetch(`${backendURL}/mediators/mediator-login`, {
        method: "POST",
        credentials: "include", // receive httpOnly cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediator_email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.message || "Login failed");
      }

      // Backend returns { user, accessToken, refreshToken }
      // Persist only what's needed for re-hydration on refresh
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("access_token", data.accessToken); // ✅ correct key

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("access_token") || null, // ✅ correct key
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
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
        state.token = action.payload.accessToken; // ✅ was 'token', now 'accessToken'
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
