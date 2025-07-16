import styled from 'styled-components';
import { colors } from './GlobalStyles';

export const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  max-width: 100%;
  overflow-x: auto;
`;

export const ReportTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${colors.card};
  color: ${colors.text};
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`;

export const ReportRow = styled.tr`
  border-bottom: 1px solid ${colors.textSecondary};

  @media (max-width: 600px) {
    display: flex;
    flex-wrap: wrap;
    padding: 8px;
    gap: 8px;
  }
`;

export const ReportCell = styled.td`
  padding: 8px;
  font-size: 0.9rem;
  text-align: left;

  @media (max-width: 600px) {
    padding: 4px;
    font-size: 0.8rem;
    flex: 1;
    min-width: 100px;

    &:nth-child(2), &:nth-child(3) {
      flex: 2;
      min-width: 150px;
    }
    &:nth-child(4) {
      flex: 1;
      min-width: 80px;
    }
    &:nth-child(5) {
      flex: 0 0 auto;
      min-width: auto;
    }
  }
`;

export const TotalRow = styled.tr`
  border-top: 2px solid ${colors.primary};

  @media (max-width: 600px) {
    display: flex;
    flex-wrap: wrap;
    padding: 8px;
    gap: 8px;
  }
`;

export const TotalCell = styled.td`
  padding: 8px;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: left;

  @media (max-width: 600px) {
    padding: 4px;
    font-size: 0.8rem;
    flex: 1;
    min-width: 100px;

    &:nth-child(4) {
      flex: 1;
      min-width: 80px;
    }
    &:nth-child(5) {
      flex: 0 0 auto;
      min-width: auto;
    }
  }
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