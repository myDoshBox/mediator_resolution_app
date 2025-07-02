import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slice/AuthSlice/authSlice';
import disputeReducer from './Slice/DisputeSlice/DisputeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    disputes: disputeReducer,
  },
});
