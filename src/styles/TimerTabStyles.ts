import styled from 'styled-components';
import { colors } from './GlobalStyles';

export const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: ${colors.card};
  border-radius: 4px;
  animation: slideIn 0.3s ease-in-out;
`;

export const CategoryName = styled.span`
  font-size: 0.9rem;
  color: ${colors.text};
`;

export const TimeDisplay = styled.span<{ running: string }>`
  font-size: 0.9rem;
  color: ${({ running }) => (running === 'true' ? colors.primary : colors.text)};
`;

export const Button = styled.button`
  padding: 4px 8px;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  animation: scale 0.2s ease-in-out;
  &:hover {
    opacity: 0.9;
  }
`;

export const StartButton = styled(Button)`
  background-color: ${colors.primary};
  color: ${colors.text};
`;

export const ResumeButton = styled(Button)`
  background-color: ${colors.primary};
  color: ${colors.text};
`;

export const PauseButton = styled(Button)`
  background-color: ${colors.textSecondary};
  color: ${colors.text};
`;

export const StopButton = styled(Button)`
  background-color: ${colors.danger};
  color: ${colors.text};
`;