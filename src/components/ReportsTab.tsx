import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { deleteReport } from '../features/timeTracker/CategorySlice';
import { ReportContainer, ReportTable, ReportRow, ReportCell, TotalRow, TotalCell, NoReports, Select, DeleteButton } from '../styles/ReportsTabStyles';

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

const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getMonthStart = (date: Date): Date => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getYearStart = (date: Date): Date => {
  const d = new Date(date);
  d.setMonth(0, 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const ReportsTab: React.FC = () => {
  const dispatch = useDispatch();
  const reports = useSelector((state: RootState) => state.timeTracker.reports || []);
  const categories = useSelector((state: RootState) => state.timeTracker.categories || []);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const filteredReports = selectedCategoryId === 'all'
    ? reports
    : reports.filter(report => report.categoryId === selectedCategoryId);

  const totalTime = filteredReports.reduce((sum, report) => sum + report.duration, 0);

  const now = new Date();
  const weekStart = getWeekStart(now).getTime();
  const monthStart = getMonthStart(now).getTime();
  const yearStart = getYearStart(now).getTime();

  const weekTime = filteredReports
    .filter(report => report.startTime >= weekStart)
    .reduce((sum, report) => sum + report.duration, 0);

  const monthTime = filteredReports
    .filter(report => report.startTime >= monthStart)
    .reduce((sum, report) => sum + report.duration, 0);

  const yearTime = filteredReports
    .filter(report => report.startTime >= yearStart)
    .reduce((sum, report) => sum + report.duration, 0);

  const dailyDurations = filteredReports.reduce((acc, report) => {
    const date = new Date(report.startTime).toLocaleDateString('ru-RU');
    acc[date] = (acc[date] || 0) + report.duration;
    return acc;
  }, {} as Record<string, number>);

  const dailyTimes = Object.values(dailyDurations);
  const avgDay = dailyTimes.length ? Math.round(dailyTimes.reduce((sum, time) => sum + time, 0) / dailyTimes.length) : 0;
  const maxDay = dailyTimes.length ? Math.max(...dailyTimes) : 0;
  const minDay = dailyTimes.length ? Math.min(...dailyTimes) : 0;

  const forecast = avgDay;

  const handleDelete = (index: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот отчёт?')) {
      dispatch(deleteReport(index));
    }
  };

  return (
    <ReportContainer>
      <Select
        value={selectedCategoryId}
        onChange={(e) => setSelectedCategoryId(e.target.value)}
      >
        <option value="all">Все</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
      {filteredReports.length === 0 ? (
        <NoReports>Нет отчётов</NoReports>
      ) : (
        <ReportTable>
          <thead>
            <tr>
              <ReportCell>Категория</ReportCell>
              <ReportCell>Начало</ReportCell>
              <ReportCell>Конец</ReportCell>
              <ReportCell>Длительность</ReportCell>
              <ReportCell></ReportCell>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report, index) => (
              <ReportRow key={`${report.categoryId}-${index}`}>
                <ReportCell>{report.categoryName}</ReportCell>
                <ReportCell>{formatDateTime(report.startTime)}</ReportCell>
                <ReportCell>{formatDateTime(report.endTime)}</ReportCell>
                <ReportCell>{formatTime(report.duration)}</ReportCell>
                <ReportCell>
                  <DeleteButton onClick={() => handleDelete(index)}>Удалить</DeleteButton>
                </ReportCell>
              </ReportRow>
            ))}
            <TotalRow>
              <TotalCell>Итого</TotalCell>
              <TotalCell></TotalCell>
              <TotalCell></TotalCell>
              <TotalCell>{formatTime(totalTime)}</TotalCell>
              <TotalCell></TotalCell>
            </TotalRow>
            <TotalRow>
              <TotalCell>Итого за неделю</TotalCell>
              <TotalCell></TotalCell>
              <TotalCell></TotalCell>
              <TotalCell>{formatTime(weekTime)}</TotalCell>
              <TotalCell></TotalCell>
            </TotalRow>
            <TotalRow>
              <TotalCell>Итого за месяц</TotalCell>
              <TotalCell></TotalCell>
              <TotalCell></TotalCell>
              <TotalCell>{formatTime(monthTime)}</TotalCell>
              <TotalCell></TotalCell>
            </TotalRow>
            <TotalRow>
              <TotalCell>Итого за год</TotalCell>
              <TotalCell></TotalCell>
              <TotalCell></TotalCell>
              <TotalCell>{formatTime(yearTime)}</TotalCell>
              <TotalCell></TotalCell>
            </TotalRow>
            <TotalRow>
              <TotalCell>Средний день</TotalCell>
              <TotalCell></TotalCell>
              <TotalCell></TotalCell>
              <TotalCell>{formatTime(avgDay)}</TotalCell>
              <TotalCell></TotalCell>
            </TotalRow>
            <TotalRow>
              <TotalCell>Максимальный день</TotalCell>
              <TotalCell></TotalCell>
              <TotalCell></TotalCell>
              <TotalCell>{formatTime(maxDay)}</TotalCell>
              <TotalCell></TotalCell>
            </TotalRow>
            <TotalRow>
              <TotalCell>Минимальный день</TotalCell>
              <TotalCell></TotalCell>
              <TotalCell></TotalCell>
              <TotalCell>{formatTime(minDay)}</TotalCell>
              <TotalCell></TotalCell>
            </TotalRow>
            <TotalRow>
              <TotalCell>Прогноз (ср. день)</TotalCell>
              <TotalCell></TotalCell>
              <TotalCell></TotalCell>
              <TotalCell>{formatTime(forecast)}</TotalCell>
              <TotalCell></TotalCell>
            </TotalRow>
          </tbody>
        </ReportTable>
      )}
    </ReportContainer>
  );
};

export default ReportsTab;