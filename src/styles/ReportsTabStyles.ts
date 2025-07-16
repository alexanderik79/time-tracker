import styled from 'styled-components';
import { colors } from './GlobalStyles';

export const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`;

export const ReportTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${colors.card};
  color: ${colors.text};
  border-radius: 8px;
  overflow: hidden;
`;

export const ReportRow = styled.tr`
  border-bottom: 1px solid ${colors.textSecondary};
`;

export const ReportCell = styled.td`
  padding: 8px;
  font-size: 0.9rem;
  text-align: left;
`;

export const TotalRow = styled.tr`
  border-top: 2px solid ${colors.primary};
`;

export const TotalCell = styled.td`
  padding: 8px;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: left;
`;

export const NoReports = styled.p`
  font-size: 1rem;
  color: ${colors.text};
  text-align: center;
`;

export const Select = styled.select`
  padding: 8px;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  background-color: ${colors.card};
  color: ${colors.text};
`;

export const DeleteButton = styled.button`
  padding: 4px 8px;
  font-size: 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: ${colors.danger};
  color: ${colors.text};
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;