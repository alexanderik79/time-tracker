// src/store.ts

import { configureStore } from '@reduxjs/toolkit';
import timeTrackerReducer from './features/timeTracker/CategorySlice';
import settingsReducer from './features/settings/settingsSlice';

export const store = configureStore({
  reducer: {
    timeTracker: timeTrackerReducer,
    settings: settingsReducer,
  },
});

// Выводим типы `RootState` и `AppDispatch` из самого стора
export type RootState = ReturnType<typeof store.getState>;
// Выведенный тип: {timeTracker: TimeTrackerState, settings: SettingsState}
export type AppDispatch = typeof store.dispatch;