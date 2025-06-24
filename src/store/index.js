import { configureStore } from '@reduxjs/toolkit';
import topicsReducer from './topicsSlice';
import dateTimeReducer from './dateTimeSlice';

// Redux Store Configuration
export const store = configureStore({
  reducer: {
    topics: topicsReducer,
    dateTime: dateTimeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // moment 객체는 직렬화 가능하지 않으므로 특정 액션/path는 무시
        ignoredActions: ['dateTime/updateCurrentTime'],
        ignoredPaths: ['dateTime.currentTime'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
