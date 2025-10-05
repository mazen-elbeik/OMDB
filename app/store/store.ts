import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import movieReducer from './movieSlice';

export const store = configureStore({
  reducer: {
    // counter: counterReducer,
    movies: movieReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

