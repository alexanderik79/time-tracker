import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { ReportContainer, ReportTable, ReportRow, ReportCell, TotalRow, TotalCell, NoReports } from '../styles/ReportsTabStyles';

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const ReportsTab: React.FC = () => {
  const reports = useSelector((state: RootState) => state.timeTracker.reports || []);
  const totalTime = reports.reduce((sum, report) => sum + report.duration, 0);

  return (
    <ReportContainer>
      {reports.length === 0 ? (
        <NoReports>Нет отчётов</NoReports>
      ) : (
        <ReportTable>
          <thead>
            <tr>
              <ReportCell>Категория</ReportCell>
              <ReportCell>Начало</ReportCell>
              <ReportCell>Конец</ReportCell>
              <ReportCell>Длительность</ReportCell>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <ReportRow key={`${report.categoryId}-${index}`}>
                <ReportCell>{report.categoryName}</ReportCell>
                <ReportCell>{formatDateTime(report.startTime)}</ReportCell>
                <ReportCell>{formatDateTime(report.endTime)}</ReportCell>
                <ReportCell>{formatTime(report.duration)}</ReportCell>
              </ReportRow>
            ))}
            <TotalRow>
              <TotalCell>Итого</TotalCell>
              <TotalCell></TotalCell>
              <TotalCell></TotalCell>
              <TotalCell>{formatTime(totalTime)}</TotalCell>
            </TotalRow>
          </tbody>
        </ReportTable>
      )}
    </ReportContainer>
  );
};

export default ReportsTab;