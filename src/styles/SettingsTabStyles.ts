// src/styles/SettingsTabStyles.ts

import styled from 'styled-components';
import { colors } from './GlobalStyles';

export const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: ${colors.card};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  margin: 20px auto; /* Центрируем контейнер */

  @media (max-width: 600px) {
    padding: 15px;
    margin: 15px auto;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 0.95rem;
  color: ${colors.textSecondary};
  margin-bottom: 4px;
`;

export const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid ${colors.textSecondary};
  border-radius: 4px;
  background-color: ${colors.background};
  color: ${colors.text};
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

export const Select = styled.select`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid ${colors.textSecondary};
  border-radius: 4px;
  background-color: ${colors.background};
  color: ${colors.text};
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

export const Button = styled.button`
  padding: 12px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: ${colors.primary};
  color: ${colors.text};
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${colors.primaryHover};
  }
  &:disabled {
    background-color: ${colors.textSecondary};
    cursor: not-allowed;
  }
`;