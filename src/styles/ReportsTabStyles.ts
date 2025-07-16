import styled from 'styled-components';
import { colors } from './GlobalStyles';

export const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ReportTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const ReportRow = styled.tr`
  animation: slideIn 0.3s ease-in-out;
`;

export const ReportCell = styled.td`
  padding: 8px;
  font-size: 0.9rem;
  color: ${colors.text};
  border-bottom: 1px solid ${colors.textSecondary};
`;

export const TotalRow = styled.tr`
  font-weight: bold;
`;

export const TotalCell = styled.td`
  padding: 8px;
  font-size: 1rem;
  color: ${colors.primary};
`;

export const NoReports = styled.p`
  font-size: 0.9rem;
  color: ${colors.textSecondary};
`;