// src/features/settings/settingsSlice.ts

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  name: string;
  phoneNumber: string;
  // hourlyRate: number; // <--- УДАЛИТЬ ЭТУ СТРОКУ
  currency: string;
  language: string;
}

const loadSettingsFromLocalStorage = (): SettingsState => {
  try {
    const serializedSettings = localStorage.getItem('appSettings');
    if (serializedSettings === null) {
      return {
        name: '',
        phoneNumber: '',
        // hourlyRate: 0, // <--- УДАЛИТЬ ЭТУ СТРОКУ
        currency: 'USD',
        language: 'ru',
      };
    }
    const settings = JSON.parse(serializedSettings);
    // Убедитесь, что hourlyRate не попадет сюда, если он был в старых данных localStorage
    delete settings.hourlyRate;
    return settings;
  } catch (e) {
    console.warn('Failed to load settings from localStorage:', e);
    return {
      name: '',
      phoneNumber: '',
      currency: 'USD',
      language: 'ru',
    };
  }
};

const initialState: SettingsState = loadSettingsFromLocalStorage();

const saveSettingsToLocalStorage = (settings: SettingsState) => {
  try {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings to localStorage:', e);
  }
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<SettingsState>) => {
      state.name = action.payload.name;
      state.phoneNumber = action.payload.phoneNumber;
      // state.hourlyRate = action.payload.hourlyRate; // <--- УДАЛИТЬ ЭТУ СТРОКУ
      state.currency = action.payload.currency;
      state.language = action.payload.language;
      saveSettingsToLocalStorage(state);
    },
  },
});

export const { setSettings } = settingsSlice.actions;
export default settingsSlice.reducer;