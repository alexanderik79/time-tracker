import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { deleteReport } from '../features/timeTracker/CategorySlice'; // Убедитесь, что deleteReport импортируется корректно
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
  // Убедитесь, что путь к reports и categories правильный в Redux store
  const reports = useSelector((state: RootState) => state.timeTracker.reports || []);
  const categories = useSelector((state: RootState) => state.timeTracker.categories || []);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<string>(now.getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((now.getMonth() + 1).toString().padStart(2, '0'));

  const years = Array.from({ length: 10 }, (_, i) => (now.getFullYear() - 5 + i).toString());
  const months = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
  ];

  // Вычисляем начало и конец месяца для фильтрации
  const monthStart = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, 1, 0, 0, 0, 0).getTime();
  const monthEnd = getMonthEnd(new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1)).getTime();

  const filteredReports = reports
    .filter(report => selectedCategoryId === 'all' || report.categoryId === selectedCategoryId)
    .filter(report => report.startTime >= monthStart && report.startTime <= monthEnd);

  const totalTime = filteredReports.reduce((sum, report) => sum + report.duration, 0);

  // Пересчитываем weekStart и yearStart на основе выбранного года/месяца, если это требуется для статистики
  // Текущая реализация weekTime и yearTime использует 'now', что может быть нелогично при фильтрации по месяцам/годам
  // Если weekTime и yearTime должны также фильтроваться по selectedYear/Month, то их логику нужно скорректировать.
  // Например, для yearTime:
  const currentYearStartForFilter = getYearStart(new Date(parseInt(selectedYear), parseInt(selectedMonth) -1)).getTime(); // Год начала выбранного месяца
  const yearTime = filteredReports
    .filter(report => report.startTime >= currentYearStartForFilter)
    .reduce((sum, report) => sum + report.duration, 0);

  // Для weekTime, если она должна быть в контексте выбранного месяца, это сложнее,
  // так как неделя может выходить за пределы месяца. Пока оставим как есть,
  // предполагая, что "Итого за неделю" это текущая неделя, а не неделя выбранного периода.
  const weekStart = getWeekStart(now).getTime();
  const weekTime = filteredReports // Применяем фильтр по категории и месяцу
    .filter(report => report.startTime >= weekStart) // Затем фильтр по текущей неделе
    .reduce((sum, report) => sum + report.duration, 0);

  const monthTime = totalTime; // monthTime уже равен totalTime, т.к. filteredReports уже по месяцу

  const dailyDurations = filteredReports.reduce((acc, report) => {
    const date = new Date(report.startTime).toLocaleDateString('ru-RU');
    acc[date] = (acc[date] || 0) + report.duration;
    return acc;
  }, {} as Record<string, number>);

  const dailyTimes = Object.values(dailyDurations);
  const avgDay = dailyTimes.length ? Math.round(dailyTimes.reduce((sum, time) => sum + time, 0) / dailyTimes.length) : 0;
  const maxDay = dailyTimes.length ? Math.max(...dailyTimes) : 0;
  const minDay = dailyTimes.length ? Math.min(...dailyTimes) : 0;

  const forecast = avgDay; // Прогноз = средний день, если нет другой логики

  const handleDelete = (index: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот отчёт?')) {
      dispatch(deleteReport(index));
    }
  };

  return (
    <ReportContainer>
      <FilterContainer>
        {/* Категории */}
        <FormControl sx={{ m: 1, minWidth: 120 }}> {/* FormControl для лучшего UI/UX */}
          <InputLabel id="category-select-label" className="inputLabel-cust">Категория</InputLabel>
          <Select
            className="select-cust"
            labelId="category-select-label" // Связываем с InputLabel
            id="category-select"
            value={selectedCategoryId}
            label="Категория" // Добавляем label для Material-UI Select
            onChange={(e) => setSelectedCategoryId(e.target.value as string)} // Приводим тип
          >
            <MenuItem value="all">Все</MenuItem>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Год */}
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

        {/* Месяц */}
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
                  <DeleteButton onClick={() => handleDelete(index)}>Удалить</DeleteButton>
                </ReportCardItem>
              </ReportCard>
            ))}
            <StatsContainer>
              <ReportCardItem>
                <strong>Итого:</strong> {formatTime(totalTime)}
              </ReportCardItem>
              <ReportCardItem>
                <strong>Итого за неделю:</strong> {formatTime(weekTime)}
              </ReportCardItem>
              <ReportCardItem>
                <strong>Итого за месяц:</strong> {formatTime(monthTime)}
              </ReportCardItem>
              <ReportCardItem>
                <strong>Итого за год:</strong> {formatTime(yearTime)}
              </ReportCardItem>
              <ReportCardItem>
                <strong>Средний день:</strong> {formatTime(avgDay)}
              </ReportCardItem>
              <ReportCardItem>
                <strong>Максимальный день:</strong> {formatTime(maxDay)}
              </ReportCardItem>
              <ReportCardItem>
                <strong>Минимальный день:</strong> {formatTime(minDay)}
              </ReportCardItem>
              <ReportCardItem>
                <strong>Прогноз (ср. день):</strong> {formatTime(forecast)}
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
        </>
      )}
    </ReportContainer>
  );
};

export default ReportsTab;