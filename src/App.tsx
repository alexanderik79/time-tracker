// src/App.tsx

import './i18n';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from './store';
import { GlobalStyle } from './styles/GlobalStyles';
import { AppContainer, Nav, NavButton } from './styles/AppStyles';
import TimerTab from './components/TimerTab';
import ReportsTab from './components/ReportsTab';
import AddCategory from './components/AddCategory';
import SettingsTab from './components/SettingsTab';

import TimerIcon from '@mui/icons-material/Timer';
import AssessmentIcon from '@mui/icons-material/Assessment'; 
import CategoryIcon from '@mui/icons-material/Category';     
import SettingsIcon from '@mui/icons-material/Settings';     

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <BrowserRouter>
        <AppContainer>
          <Nav>
            <NavButton to="/" end>
              <TimerIcon /> {/* Иконка для Таймера */}
            </NavButton>
            <NavButton to="/reports">
              <AssessmentIcon /> {/* Иконка для Отчётов */}
            </NavButton>
            <NavButton to="/categories">
              <CategoryIcon /> {/* Иконка для Категорий */}
            </NavButton>
            <NavButton to="/settings">
              <SettingsIcon /> {/* Иконка для Настроек */}
            </NavButton>
          </Nav>
          <Routes>
            <Route path="/" element={<TimerTab />} />
            <Route path="/reports" element={<ReportsTab />} />
            <Route path="/categories" element={<AddCategory />} />
            <Route path="/settings" element={<SettingsTab />} />
          </Routes>
        </AppContainer>
      </BrowserRouter>
    </Provider>
  );
};

export default App;