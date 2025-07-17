// src/App.tsx

import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from './store';
import { GlobalStyle } from './styles/GlobalStyles';
import { AppContainer, Nav, NavButton } from './styles/AppStyles';
import TimerTab from './components/TimerTab';
import ReportsTab from './components/ReportsTab';
import AddCategory from './components/AddCategory';
import SettingsTab from './components/SettingsTab'; // <--- Импортируем новый компонент

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <BrowserRouter>
        <AppContainer>
          <Nav>
            <NavButton to="/" end>
              Таймер
            </NavButton>
            <NavButton to="/reports">
              Отчёты
            </NavButton>
            <NavButton to="/categories">
              Категории
            </NavButton>
            <NavButton to="/settings"> {/* <--- Добавляем новую кнопку навигации */}
              Настройки
            </NavButton>
          </Nav>
          <Routes>
            <Route path="/" element={<TimerTab />} />
            <Route path="/reports" element={<ReportsTab />} />
            <Route path="/categories" element={<AddCategory />} />
            <Route path="/settings" element={<SettingsTab />} /> {/* <--- Добавляем новый маршрут */}
          </Routes>
        </AppContainer>
      </BrowserRouter>
    </Provider>
  );
};

export default App;