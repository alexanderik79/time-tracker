// src/features/timeTracker/CategorySlice.ts

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Category {
  id: string;
  name: string;
  time: number;
  running: boolean;
  paused: boolean;
  startTime: number | null;
  hourlyRate: number;
}

export interface Report {
  id: string;
  categoryId: string;
  categoryName: string;
  startTime: number;
  endTime: number;
  duration: number;
  hourlyRate: number;
}

interface TimeTrackerState {
  categories: Category[];
  lastSelectedCategory: string | null;
  reports: Report[];
}

const loadState = (): TimeTrackerState => {
  try {
    const serializedState = localStorage.getItem('timeTrackerState');
    if (serializedState === null) {
      return { categories: [], lastSelectedCategory: null, reports: [] };
    }
    const state: TimeTrackerState = JSON.parse(serializedState);
    
    state.categories = state.categories.map(category => ({
      ...category,
      hourlyRate: category.hasOwnProperty('hourlyRate') ? category.hourlyRate : 0,
      running: false,
      paused: false,
      startTime: null,
    }));
    state.reports = state.reports.map(report => ({
      ...report,
      hourlyRate: report.hasOwnProperty('hourlyRate') ? report.hourlyRate : 0,
    }));

    return state;
  } catch (e) {
    console.warn("Could not load state from localStorage", e);
    return { categories: [], lastSelectedCategory: null, reports: [] };
  }
};

const saveState = (state: TimeTrackerState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('timeTrackerState', serializedState);
  } catch (e) {
    console.warn("Could not save state to localStorage", e);
  }
};

const initialState: TimeTrackerState = loadState();

const timeTrackerSlice = createSlice({
  name: 'timeTracker',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<{ name: string; hourlyRate: number }>) => {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: action.payload.name,
        time: 0,
        running: false,
        paused: false,
        startTime: null,
        hourlyRate: action.payload.hourlyRate,
      };
      state.categories.push(newCategory);
      saveState(state);
    },
    updateCategory: (state, action: PayloadAction<{ id: string; name: string; hourlyRate: number }>) => {
      const category = state.categories.find(cat => cat.id === action.payload.id);
      if (category) {
        category.name = action.payload.name;
        category.hourlyRate = action.payload.hourlyRate;
        saveState(state);
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat.id !== action.payload);
      state.reports = state.reports.filter(report => report.categoryId !== action.payload);
      if (state.lastSelectedCategory === action.payload) {
        state.lastSelectedCategory = null;
      }
      saveState(state);
    },
    startTimer: (state, action: PayloadAction<string>) => {
      const newCategoryId = action.payload;
      const currentActiveCategory = state.categories.find(cat => cat.running);
      
      if (currentActiveCategory && currentActiveCategory.id !== newCategoryId) {
        if (currentActiveCategory.startTime !== null) {
          const endTime = Date.now();
          const duration = Math.floor((endTime - currentActiveCategory.startTime) / 1000);
          
          state.reports.unshift({
            id: Date.now().toString(),
            categoryId: currentActiveCategory.id,
            categoryName: currentActiveCategory.name,
            startTime: currentActiveCategory.startTime,
            endTime: endTime,
            duration: duration,
            hourlyRate: currentActiveCategory.hourlyRate,
          });
          currentActiveCategory.time += duration;
        }
        currentActiveCategory.running = false;
        currentActiveCategory.paused = false;
        currentActiveCategory.startTime = null;
      }

      const categoryToStart = state.categories.find(cat => cat.id === newCategoryId);
      if (categoryToStart && !categoryToStart.running) {
        categoryToStart.running = true;
        categoryToStart.paused = false;
        categoryToStart.startTime = Date.now();
        state.lastSelectedCategory = categoryToStart.id;
        saveState(state);
      }
    },
    stopTimer: (state) => {
      const activeCategory = state.categories.find(cat => cat.running || cat.paused);
      if (activeCategory && activeCategory.startTime !== null) {
        const endTime = Date.now();
        const duration = Math.floor((endTime - activeCategory.startTime) / 1000);
        
        if (duration > 0) {
          state.reports.unshift({
            id: Date.now().toString(),
            categoryId: activeCategory.id,
            categoryName: activeCategory.name,
            startTime: activeCategory.startTime,
            endTime: endTime,
            duration: duration,
            hourlyRate: activeCategory.hourlyRate,
          });
          activeCategory.time += duration;
        }

        activeCategory.running = false;
        activeCategory.paused = false;
        activeCategory.startTime = null;
        // Убрали сброс state.lastSelectedCategory
        saveState(state);
      }
    },
    pauseTimer: (state) => {
      const activeCategory = state.categories.find(cat => cat.running);
      if (activeCategory && activeCategory.startTime !== null) {
        activeCategory.running = false;
        activeCategory.paused = true;
        const elapsed = Math.floor((Date.now() - activeCategory.startTime) / 1000);
        activeCategory.time += elapsed;
        activeCategory.startTime = Date.now();
        saveState(state);
      }
    },
    resumeTimer: (state) => {
      const pausedCategory = state.categories.find(cat => cat.paused);
      if (pausedCategory) {
        const currentActiveCategory = state.categories.find(cat => cat.running);
        if (currentActiveCategory && currentActiveCategory.id !== pausedCategory.id) {
          if (currentActiveCategory.startTime !== null) {
            const endTime = Date.now();
            const duration = Math.floor((endTime - currentActiveCategory.startTime) / 1000);
            if (duration > 0) {
              state.reports.unshift({
                id: Date.now().toString(),
                categoryId: currentActiveCategory.id,
                categoryName: currentActiveCategory.name,
                startTime: currentActiveCategory.startTime,
                endTime: endTime,
                duration: duration,
                hourlyRate: currentActiveCategory.hourlyRate,
              });
              currentActiveCategory.time += duration;
            }
          }
          currentActiveCategory.running = false;
          currentActiveCategory.paused = false;
          currentActiveCategory.startTime = null;
        }

        pausedCategory.running = true;
        pausedCategory.paused = false;
        pausedCategory.startTime = Date.now();
        state.lastSelectedCategory = pausedCategory.id;
        saveState(state);
      }
    },
    updateTime: (state, action: PayloadAction<{ id: string }>) => {
      const category = state.categories.find(cat => cat.id === action.payload.id);
      if (category && category.running && category.startTime) {
        // Пустой, так как время обновляется в UI
      }
    },
    syncTime: (state) => {
      state.categories.forEach(category => {
        if (category.running && category.startTime) {
          const elapsed = Math.floor((Date.now() - category.startTime) / 1000);
          category.time += elapsed;
          category.startTime = Date.now();
        }
      });
      saveState(state);
    },
    selectCategory: (state, action: PayloadAction<string>) => {
      state.lastSelectedCategory = action.payload;
      saveState(state);
    },
    deleteReport: (state, action: PayloadAction<number>) => {
      state.reports.splice(action.payload, 1);
      saveState(state);
    },
  },
});

export const {
  addCategory,
  updateCategory,
  deleteCategory,
  startTimer,
  stopTimer,
  pauseTimer,
  resumeTimer,
  updateTime,
  syncTime,
  selectCategory,
  deleteReport,
} = timeTrackerSlice.actions;

export default timeTrackerSlice.reducer;