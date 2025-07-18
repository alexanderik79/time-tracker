// src/components/ReportsTab.tsx

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store'; // Убедитесь, что RootState правильно импортирован
import { deleteReport } from '../features/timeTracker/CategorySlice';
import { ReportContainer, ReportTable, ReportRow, ReportCell, TotalRow, TotalCell, NoReports, DeleteButton, ReportCard, ReportCardItem, StatsContainer, FilterContainer } from '../styles/ReportsTabStyles';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl'; 

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

const formatMoney = (amount: number, currency: string, language: string): string => {
    return new Intl.NumberFormat(language, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1; // Понедельник - первый день недели
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getYearStart = (date: Date): Date => {
  const d = new Date(date);
  d.setMonth(0, 1); // Устанавливаем 1 января
  d.setHours(0, 0, 0, 0);
  return d;
};

const getMonthEnd = (date: Date): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1); // Переходим на следующий месяц
  d.setDate(0); // Устанавливаем на 0-й день следующего месяца, что является последним днем текущего
  d.setHours(23, 59, 59, 999);
  return d;
};

const ReportsTab: React.FC = () => {
  const dispatch = useDispatch();
  const reports = useSelector((state: RootState) => state.timeTracker.reports || []);
  const categories = useSelector((state: RootState) => state.timeTracker.categories || []);
  const settings = useSelector((state: RootState) => state.settings);
  const { currency, language } = settings;
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<string>(now.getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((now.getMonth() + 1).toString().padStart(2, '0'));

  const years = Array.from({ length: 5 }, (_, i) => (now.getFullYear() - 4 + i).toString());
  const months = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
  ];

  const monthStart = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, 1, 0, 0, 0, 0).getTime();
  const monthEnd = getMonthEnd(new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1)).getTime();

  const filteredReports = reports
    .filter(report => selectedCategoryId === 'all' || report.categoryId === selectedCategoryId)
    .filter(report => report.startTime >= monthStart && report.startTime <= monthEnd);

  // Общее время и заработок для отфильтрованных отчетов
  const totalTime = filteredReports.reduce((sum, report) => sum + report.duration, 0);
  const totalEarnedAmount = filteredReports.reduce((sum, report) => sum + (report.duration / 3600) * (report.hourlyRate || 0), 0);

  // Итого за год (в контексте выбранного фильтра)
  const currentYearStartForFilter = getYearStart(new Date(parseInt(selectedYear), parseInt(selectedMonth) -1)).getTime();
  const yearReports = filteredReports
    .filter(report => report.startTime >= currentYearStartForFilter);
  const yearTime = yearReports.reduce((sum, report) => sum + report.duration, 0);
  const yearEarnedAmount = yearReports.reduce((sum, report) => sum + (report.duration / 3600) * (report.hourlyRate || 0), 0);

  // Итого за неделю (в контексте выбранного фильтра, если отчет попадает в текущую неделю)
  const weekStart = getWeekStart(now).getTime();
  const weekReports = filteredReports // Применяем фильтр по категории и месяцу
    .filter(report => report.startTime >= weekStart); // Затем фильтр по текущей неделе
  const weekTime = weekReports.reduce((sum, report) => sum + report.duration, 0);
  const weekEarnedAmount = weekReports.reduce((sum, report) => sum + (report.duration / 3600) * (report.hourlyRate || 0), 0);

  const monthTime = totalTime; // monthTime уже равен totalTime, т.к. filteredReports уже по месяцу
  const monthEarnedAmount = totalEarnedAmount;

  // Расчеты для среднего, максимального и минимального дня
  const dailyDurations: Record<string, { duration: number, earned: number }> = filteredReports.reduce((acc: Record<string, { duration: number, earned: number }>, report) => { // <--- ИСПРАВЛЕНИЕ ЗДЕСЬ
    const date = new Date(report.startTime).toLocaleDateString('ru-RU');
    acc[date] = acc[date] || { duration: 0, earned: 0 };
    acc[date].duration += report.duration;
    acc[date].earned += (report.duration / 3600) * (report.hourlyRate || 0);
    return acc;
  }, {}); // <--- И здесь, явно указываем тип для начального значения reduce

  const dailyStats = Object.values(dailyDurations);
  
  const avgDay = dailyStats.length ? Math.round(dailyStats.reduce((sum, stat) => sum + stat.duration, 0) / dailyStats.length) : 0;
  const avgDayEarned = dailyStats.length ? dailyStats.reduce((sum, stat) => sum + stat.earned, 0) / dailyStats.length : 0;
  
  const maxDay = dailyStats.length ? Math.max(...dailyStats.map(stat => stat.duration)) : 0;
  const maxDayEarned = dailyStats.length ? Math.max(...dailyStats.map(stat => stat.earned)) : 0;
  
  const minDay = dailyStats.length ? Math.min(...dailyStats.map(stat => stat.duration)) : 0;
  const minDayEarned = dailyStats.length ? Math.min(...dailyStats.map(stat => stat.earned)) : 0;

  const forecast = avgDay; 
  const forecastEarned = avgDayEarned;


  const handleDelete = (index: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот отчёт?')) {
      dispatch(deleteReport(index));
    }
  };

  return (
    <ReportContainer>
      <FilterContainer>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="category-select-label" className="inputLabel-cust">Категория</InputLabel>
          <Select
            className="select-cust"
            labelId="category-select-label"
            id="category-select"
            value={selectedCategoryId}
            label="Категория"
            onChange={(e) => setSelectedCategoryId(e.target.value as string)}
          >
            <MenuItem value="all">Все</MenuItem>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="year-select-label" className="inputLabel-cust">Год</InputLabel>
          <Select
            className="select-cust"
            labelId="year-select-label"
            id="year-select"
            value={selectedYear}
            label="Год"
            onChange={(e) => setSelectedYear(e.target.value as string)}
          >
            {years.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="month-select-label" className="inputLabel-cust">Месяц</InputLabel>
          <Select
            className="select-cust"
            labelId="month-select-label"
            id="month-select"
            value={selectedMonth}
            label="Месяц"
            onChange={(e) => setSelectedMonth(e.target.value as string)}
          >
            {months.map(month => (
              <MenuItem key={month} value={month}>{month}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </FilterContainer>

      {filteredReports.length === 0 ? (
        <NoReports>Нет отчётов за выбранный период</NoReports>
      ) : (
        <>
          <div className="mobile-reports">
            {filteredReports.map((report, index) => (
              <ReportCard key={`${report.categoryId}-${index}`}>
                <ReportCardItem>
                  <strong>Категория:</strong> {report.categoryName}
                </ReportCardItem>
                <ReportCardItem>
                  <strong>Начало:</strong> {formatDateTime(report.startTime)}
                </ReportCardItem>
                <ReportCardItem>
                  <strong>Конец:</strong> {formatDateTime(report.endTime)}
                </ReportCardItem>
                <ReportCardItem>
                  <strong>Длительность:</strong> {formatTime(report.duration)}
                </ReportCardItem>
                <ReportCardItem>
                  <strong>Заработок:</strong> {formatMoney((report.duration / 3600) * (report.hourlyRate || 0), currency, language)}
                </ReportCardItem>
                <ReportCardItem>
                  <DeleteButton onClick={() => handleDelete(index)}>Удалить</DeleteButton>
                </ReportCardItem>
              </ReportCard>
            ))}
            <StatsContainer>
              <ReportCardItem>
                <strong>Итого:</strong> {formatTime(totalTime)} ({formatMoney(totalEarnedAmount, currency, language)})
              </ReportCardItem>
              <ReportCardItem>
                <strong>Итого за неделю:</strong> {formatTime(weekTime)} ({formatMoney(weekEarnedAmount, currency, language)})
              </ReportCardItem>
              <ReportCardItem>
                <strong>Итого за месяц:</strong> {formatTime(monthTime)} ({formatMoney(monthEarnedAmount, currency, language)})
              </ReportCardItem>
              <ReportCardItem>
                <strong>Итого за год:</strong> {formatTime(yearTime)} ({formatMoney(yearEarnedAmount, currency, language)})
              </ReportCardItem>
              <ReportCardItem>
                <strong>Средний день:</strong> {formatTime(avgDay)} ({formatMoney(avgDayEarned, currency, language)})
              </ReportCardItem>
              <ReportCardItem>
                <strong>Максимальный день:</strong> {formatTime(maxDay)} ({formatMoney(maxDayEarned, currency, language)})
              </ReportCardItem>
              <ReportCardItem>
                <strong>Минимальный день:</strong> {formatTime(minDay)} ({formatMoney(minDayEarned, currency, language)})
              </ReportCardItem>
              <ReportCardItem>
                <strong>Прогноз (ср. день):</strong> {formatTime(forecast)} ({formatMoney(forecastEarned, currency, language)})
              </ReportCardItem>
            </StatsContainer>
          </div>
          <ReportTable className="desktop-reports">
            <thead>
              <tr>
                <ReportCell>Категория</ReportCell>
                <ReportCell>Начало</ReportCell>
                <ReportCell>Конец</ReportCell>
                <ReportCell>Длительность</ReportCell>
                <ReportCell>Заработок</ReportCell>
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
                  <ReportCell>{formatMoney((report.duration / 3600) * (report.hourlyRate || 0), currency, language)}</ReportCell>
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
                <TotalCell>{formatMoney(totalEarnedAmount, currency, language)}</TotalCell>
                <TotalCell></TotalCell>
              </TotalRow>
              <TotalRow>
                <TotalCell>Итого за неделю</TotalCell>
                <TotalCell></TotalCell>
                <TotalCell></TotalCell>
                <TotalCell>{formatTime(weekTime)}</TotalCell>
                <TotalCell>{formatMoney(weekEarnedAmount, currency, language)}</TotalCell>
                <TotalCell></TotalCell>
              </TotalRow>
              <TotalRow>
                <TotalCell>Итого за месяц</TotalCell>
                <TotalCell></TotalCell>
                <TotalCell></TotalCell>
                <TotalCell>{formatTime(monthTime)}</TotalCell>
                <TotalCell>{formatMoney(monthEarnedAmount, currency, language)}</TotalCell>
                <TotalCell></TotalCell>
              </TotalRow>
              <TotalRow>
                <TotalCell>Итого за год</TotalCell>
                <TotalCell></TotalCell>
                <TotalCell></TotalCell>
                <TotalCell>{formatTime(yearTime)}</TotalCell>
                <TotalCell>{formatMoney(yearEarnedAmount, currency, language)}</TotalCell>
                <TotalCell></TotalCell>
              </TotalRow>
              <TotalRow>
                <TotalCell>Средний день</TotalCell>
                <TotalCell></TotalCell>
                <TotalCell></TotalCell>
                <TotalCell>{formatTime(avgDay)}</TotalCell>
                <TotalCell>{formatMoney(avgDayEarned, currency, language)}</TotalCell>
                <TotalCell></TotalCell>
              </TotalRow>
              <TotalRow>
                <TotalCell>Максимальный день</TotalCell>
                <TotalCell></TotalCell>
                <TotalCell></TotalCell>
                <TotalCell>{formatTime(maxDay)}</TotalCell>
                <TotalCell>{formatMoney(maxDayEarned, currency, language)}</TotalCell>
                <TotalCell></TotalCell>
              </TotalRow>
              <TotalRow>
                <TotalCell>Минимальный день</TotalCell>
                <TotalCell></TotalCell>
                <TotalCell></TotalCell>
                <TotalCell>{formatTime(minDay)}</TotalCell>
                <TotalCell>{formatMoney(minDayEarned, currency, language)}</TotalCell>
                <TotalCell></TotalCell>
              </TotalRow>
              <TotalRow>
                <TotalCell>Прогноз (ср. день)</TotalCell>
                <TotalCell></TotalCell>
                <TotalCell></TotalCell>
                <TotalCell>{formatTime(forecast)}</TotalCell>
                <TotalCell>{formatMoney(forecastEarned, currency, language)}</TotalCell>
                <TotalCell></TotalCell>
              </TotalRow>
            </tbody>
          </ReportTable>
        </>
      )}
    </ReportContainer>
  );
};

export default ReportsTab;