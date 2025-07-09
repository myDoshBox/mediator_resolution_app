import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slice/AuthSlice/AuthSlice';
import disputeReducer from './Slice/DisputeSlice/DisputeSlice';
import resolvedDisputesReducer from './Slice/DisputeSlice/ResolvedDisputeSlice'; // ✅ Import

const store = configureStore({
  reducer: {
    auth: authReducer,
    disputes: disputeReducer,
    resolvedDisputes: resolvedDisputesReducer, // ✅ Register here
  },
});

export default store;