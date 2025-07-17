// src/features/settings/settingsSlice.ts

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// 1. Определите интерфейс для состояния настроек
interface SettingsState {
  name: string;
  phoneNumber: string;
  hourlyRate: number;
  currency: string;
  language: string;
}

// 2. Определите функцию для загрузки настроек из localStorage
const loadSettingsFromLocalStorage = (): SettingsState => {
  try {
    const serializedSettings = localStorage.getItem('appSettings'); // Используйте уникальный ключ
    if (serializedSettings === null) {
      // Возвращаем дефолтные значения, если настроек нет
      return {
        name: '',
        phoneNumber: '',
        hourlyRate: 0,
        currency: 'USD', // Или 'RUB', 'EUR' по умолчанию
        language: 'ru',  // Или 'en' по умолчанию
      };
    }
    return JSON.parse(serializedSettings);
  } catch (e) {
    console.warn('Failed to load settings from localStorage:', e);
    // В случае ошибки также возвращаем дефолтные значения
    return {
      name: '',
      phoneNumber: '',
      hourlyRate: 0,
      currency: 'USD',
      language: 'ru',
    };
  }
};

// 3. Начальное состояние
const initialState: SettingsState = loadSettingsFromLocalStorage();

// 4. Функция для сохранения настроек в localStorage
const saveSettingsToLocalStorage = (settings: SettingsState) => {
  try {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings to localStorage:', e);
  }
};

// 5. Создайте слайс
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Определите редьюсер для сохранения настроек
    // Он будет принимать новый объект настроек и обновлять состояние
    setSettings: (state, action: PayloadAction<SettingsState>) => {
      // Здесь вы можете просто присвоить новое состояние
      // Redux Toolkit использует Immer, так что прямое изменение 'state' безопасно
      state.name = action.payload.name;
      state.phoneNumber = action.payload.phoneNumber;
      state.hourlyRate = action.payload.hourlyRate;
      state.currency = action.payload.currency;
      state.language = action.payload.language;
      saveSettingsToLocalStorage(state); // Сохраняем после обновления
    },
    // Можно добавить отдельные редьюсеры для каждого поля, если это потребуется
    // Например: setUserName: (state, action: PayloadAction<string>) => { state.name = action.payload; saveSettingsToLocalStorage(state); }
  },
});

// 6. Экспортируйте экшены и редьюсер
export const { setSettings } = settingsSlice.actions; // Экшен для обновления всех настроек
export default settingsSlice.reducer;