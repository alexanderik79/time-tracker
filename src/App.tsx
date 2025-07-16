import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from './store';
import { GlobalStyle } from './styles/GlobalStyles';
import { AppContainer, Nav, NavButton } from './styles/AppStyles';
import TimerTab from './components/TimerTab';
import ReportsTab from './components/ReportsTab';
import AddCategory from './components/AddCategory';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <BrowserRouter>
        <AppContainer>
          <Nav>
            <NavButton to="/timer" end>
              Таймер
            </NavButton>
            <NavButton to="/reports">
              Отчёты
            </NavButton>
            <NavButton to="/categories">
              Категории
            </NavButton>
          </Nav>
          <Routes>
            <Route path="/timer" element={<TimerTab />} />
            <Route path="/reports" element={<ReportsTab />} />
            <Route path="/categories" element={<AddCategory />} />
          </Routes>
        </AppContainer>
      </BrowserRouter>
    </Provider>
  );
};

export default App;