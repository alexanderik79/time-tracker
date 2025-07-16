import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

interface Category {
  id: string;
  name: string;
  time: number; // В секундах
  running: boolean;
  paused: boolean;
  startTime: number | null; // Время последнего старта (для паузы/возобновления)
  sessionStartTime: number | null; // Время начала сессии (для отчёта)
}

interface Report {
  categoryId: string;
  categoryName: string;
  startTime: number;
  endTime: number;
  duration: number; // В секундах
}

interface TimeTrackerState {
  categories: Category[];
  lastSelectedCategory: string | null;
  reports: Report[];
}

const loadFromLocalStorage = (): TimeTrackerState => {
  try {
    const serializedState = localStorage.getItem('timeTracker');
    if (serializedState === null) return { categories: [], lastSelectedCategory: null, reports: [] };
    const parsed = JSON.parse(serializedState);
    return {
      categories: Array.isArray(parsed.categories)
        ? parsed.categories.map((cat: Category) => ({
            ...cat,
            startTime: cat.startTime ?? null,
            sessionStartTime: cat.sessionStartTime ?? null,
          }))
        : [],
      lastSelectedCategory: typeof parsed.lastSelectedCategory === 'string' ? parsed.lastSelectedCategory : null,
      reports: Array.isArray(parsed.reports) ? parsed.reports : [],
    };
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
    return { categories: [], lastSelectedCategory: null, reports: [] };
  }
};

const initialState: TimeTrackerState = loadFromLocalStorage();

const saveToLocalStorage = (state: TimeTrackerState) => {
  try {
    localStorage.setItem('timeTracker', JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
};

const categorySlice = createSlice({
  name: 'timeTracker',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<{ name: string }>) => {
      state.categories = state.categories || [];
      state.categories.push({
        id: crypto.randomUUID(),
        name: action.payload.name,
        time: 0,
        running: false,
        paused: false,
        startTime: null,
        sessionStartTime: null,
      });
      saveToLocalStorage(state);
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories || [];
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
      if (state.lastSelectedCategory === action.payload) {
        state.lastSelectedCategory = null;
      }
      saveToLocalStorage(state);
    },
    clearAll: (state) => {
      state.categories = [];
      state.lastSelectedCategory = null;
      state.reports = [];
      saveToLocalStorage(state);
    },
    startTimer: (state, action: PayloadAction<string>) => {
      state.categories = state.categories || [];
      state.categories = state.categories.map(cat => {
        if (cat.id === action.payload) {
          const now = Date.now();
          return { ...cat, running: true, paused: false, startTime: now, sessionStartTime: now, time: 0 };
        }
        return { ...cat, running: false, paused: false, startTime: null, sessionStartTime: null };
      });
      state.lastSelectedCategory = action.payload;
      saveToLocalStorage(state);
    },
    pauseTimer: (state, action: PayloadAction<string>) => {
      state.categories = state.categories || [];
      const category = state.categories.find(cat => cat.id === action.payload);
      if (category && category.running && category.startTime) {
        const elapsed = Date.now() - category.startTime;
        category.time += Math.floor(elapsed / 1000);
        category.running = false;
        category.paused = true;
        category.startTime = null;
      }
      saveToLocalStorage(state);
    },
    resumeTimer: (state, action: PayloadAction<string>) => {
      state.categories = state.categories || [];
      state.categories = state.categories.map(cat => {
        if (cat.id === action.payload && cat.paused) {
          return { ...cat, running: true, paused: false, startTime: Date.now() };
        }
        return cat;
      });
      state.lastSelectedCategory = action.payload;
      saveToLocalStorage(state);
    },
    stopTimer: (state, action: PayloadAction<string>) => {
      state.categories = state.categories || [];
      const category = state.categories.find(cat => cat.id === action.payload);
      if (category && (category.running || category.paused)) {
        const endTime = Date.now();
        let duration = category.time;
        const startTime = category.sessionStartTime || endTime;
        if (category.running && category.startTime) {
          const elapsed = endTime - category.startTime;
          duration += Math.floor(elapsed / 1000);
        }
        state.reports = state.reports || [];
        state.reports.push({
          categoryId: category.id,
          categoryName: category.name,
          startTime,
          endTime,
          duration,
        });
        category.time = 0;
        category.running = false;
        category.paused = false;
        category.startTime = null;
        category.sessionStartTime = null;
      }
      saveToLocalStorage(state);
    },
    updateTime: (state, action: PayloadAction<{ id: string }>) => {
      state.categories = state.categories || [];
      const category = state.categories.find(cat => cat.id === action.payload.id);
      if (category && category.running && category.startTime) {
        const elapsed = Date.now() - category.startTime;
        category.time += Math.floor(elapsed / 1000);
        category.startTime = Date.now();
      }
      saveToLocalStorage(state);
    },
    syncTime: (state) => {
      state.categories = state.categories || [];
      state.categories = state.categories.map(cat => {
        if (cat.running && cat.startTime) {
          const elapsed = Date.now() - cat.startTime;
          return { ...cat, time: cat.time + Math.floor(elapsed / 1000), startTime: Date.now() };
        }
        return cat;
      });
      saveToLocalStorage(state);
    },
    selectCategory: (state, action: PayloadAction<string>) => {
      state.lastSelectedCategory = action.payload;
      saveToLocalStorage(state);
    },
  },
});

export const { addCategory, deleteCategory, clearAll, startTimer, pauseTimer, resumeTimer, stopTimer, updateTime, syncTime, selectCategory } = categorySlice.actions;
export const selectCategories = (state: RootState) => state.timeTracker.categories;
export const selectLastCategory = (state: RootState) => state.timeTracker.lastSelectedCategory;
export const selectReports = (state: RootState) => state.timeTracker.reports;
export default categorySlice.reducer;