// src/styles/TimerTabStyles.ts

import styled from 'styled-components';
import { colors } from './GlobalStyles';

export const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`;

export const Select = styled.select`
  padding: 8px;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  background-color: ${colors.card};
  color: ${colors.text};
`;

export const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: ${colors.card};
  border-radius: 8px;
  animation: slideIn 0.3s ease-in-out;
`;

export const CategoryName = styled.span`
  font-size: 1rem;
  color: ${colors.text};
  margin-bottom: 12px;
`;

export const TimeDisplay = styled.span<{ running: string }>`
  font-size: ${props => (props.running === 'true' ? '2rem' : '2rem')};
  color: ${({ running }) => (running === 'true' ? colors.primary : colors.text)};
  font-weight: bold;
  text-align: center;
  display: block; /* <--- Убедитесь, что эта строка есть */
`;

export const Button = styled.button`
  padding: 8px 16px;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  animation: scale 0.2s ease-in-out;
  &:hover {
    opacity: 0.9;
  }
`;

export const ResumeButton = styled(Button)`
  background-color: ${colors.primary};
  color: ${colors.text};
  margin-top: 12px;
`;

export const StartButton = styled(Button)`
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background-color: ${colors.primary};
  color: ${colors.text};
  display: flex; /* <--- Убедитесь, что display: flex есть */
  flex-direction: column; /* <--- Убедитесь, что flex-direction: column есть */
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const StopButton = styled(Button)`
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background-color: ${colors.danger};
  color: ${colors.text};
  display: flex; /* <--- Убедитесь, что display: flex есть */
  flex-direction: column; /* <--- Убедитесь, что flex-direction: column есть */
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;







