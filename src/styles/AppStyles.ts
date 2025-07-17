import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { colors } from './GlobalStyles';

export const AppContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

export const Nav = styled.nav`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
`;

export const NavButton = styled(NavLink)`
  padding: 8px 16px;
  background-color: ${colors.primary};
  color: ${colors.text};
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.9rem;
  &.active {
    background-color: ${colors.primaryHover};
  }
  &:hover {
    background-color: ${colors.primaryHover};
  }
`;