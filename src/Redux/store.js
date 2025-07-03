import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slice/AuthSlice/AuthSlice';
import disputeReducer from './Slice/DisputeSlice/DisputeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    disputes: disputeReducer,
  },
});

export default store;
