// src/store.ts

import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import timeTrackerReducer from './features/timeTracker/CategorySlice';
import settingsReducer from './features/settings/settingsSlice'; // Импортируем новый редьюсер

export const store = configureStore({
  reducer: {
    timeTracker: timeTrackerReducer,
    settings: settingsReducer, // Добавляем новый редьюсер
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;