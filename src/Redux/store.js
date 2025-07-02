import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slice/AuthSlice/AuthSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export { store };
