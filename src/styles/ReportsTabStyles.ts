import styled from 'styled-components';
import { colors } from './GlobalStyles';

export const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  max-width: 100%;
`;

export const ReportTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${colors.card};
  color: ${colors.text};
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 600px) {
    display: none;
  }
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
  width: 100%;
  max-width: 250px;

  @media (max-width: 600px) {
    font-size: 0.8rem;
    padding: 6px;
  }
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

  @media (max-width: 600px) {
    padding: 3px 6px;
    font-size: 0.7rem;
  }
`;

export const ReportCard = styled.div`
  display: none;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background-color: ${colors.card};
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-in-out;

  @media (max-width: 600px) {
    display: flex;
  }
`;

export const ReportCardItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: ${colors.text};

  strong {
    font-weight: 600;
    color: ${colors.textSecondary};
  }
`;

export const StatsContainer = styled.div`
  display: none;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background-color: ${colors.card};
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 600px) {
    display: flex;
  }
`;