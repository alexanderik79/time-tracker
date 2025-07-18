// src/components/ReportsTab.tsx

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState, AppDispatch } from '../store';
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

const formatDateTime = (timestamp: number, language: string): string => {
  return new Date(timestamp).toLocaleString(language, {
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
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getYearStart = (date: Date): Date => {
  const d = new Date(date);
  d.setMonth(0, 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getMonthEnd = (date: Date): Date => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
};

const ReportsTab: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
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

  const totalTime = filteredReports.reduce((sum, report) => sum + report.duration, 0);
  const totalEarnedAmount = filteredReports.reduce((sum, report) => sum + (report.duration / 3600) * (report.hourlyRate || 0), 0);

  const currentYearStartForFilter = getYearStart(new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1)).getTime();
  const yearReports = filteredReports
    .filter(report => report.startTime >= currentYearStartForFilter);
  const yearTime = yearReports.reduce((sum, report) => sum + report.duration, 0);
  const yearEarnedAmount = yearReports.reduce((sum, report) => sum + (report.duration / 3600) * (report.hourlyRate || 0), 0);

  const weekStart = getWeekStart(now).getTime();
  const weekReports = filteredReports
    .filter(report => report.startTime >= weekStart);
  const weekTime = weekReports.reduce((sum, report) => sum + report.duration, 0);
  const weekEarnedAmount = weekReports.reduce((sum, report) => sum + (report.duration / 3600) * (report.hourlyRate || 0), 0);

  const monthTime = totalTime;
  const monthEarnedAmount = totalEarnedAmount;

  const dailyDurations: Record<string, { duration: number, earned: number }> = filteredReports.reduce((acc: Record<string, { duration: number, earned: number }>, report) => {
    const date = new Date(report.startTime).toLocaleDateString(language);
    acc[date] = acc[date] || { duration: 0, earned: 0 };
    acc[date].duration += report.duration;
    acc[date].earned += (report.duration / 3600) * (report.hourlyRate || 0);
    return acc;
  }, {});

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
    if (window.confirm(t('reports.delete_confirm'))) {
      dispatch(deleteReport(index));
    }
  };

  return (
    <ReportContainer>
      <FilterContainer>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="category-select-label" className="inputLabel-cust">{t('reports.category_label')}</InputLabel>
          <Select
            className="select-cust"
            labelId="category-select-label"
            id="category-select"
            value={selectedCategoryId}
            label={t('reports.category_label')}
            onChange={(e) => setSelectedCategoryId(e.target.value as string)}
          >
            <MenuItem value="all">{t('reports.all_categories')}</MenuItem>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="year-select-label" className="inputLabel-cust">{t('reports.year_label')}</InputLabel>
          <Select
            className="select-cust"
            labelId="year-select-label"
            id="year-select"
            value={selectedYear}
            label={t('reports.year_label')}
            onChange={(e) => setSelectedYear(e.target.value as string)}
          >
            {years.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="month-select-label" className="inputLabel-cust">{t('reports.month_label')}</InputLabel>
          <Select
            className="select-cust"
            labelId="month-select-label"
            id="month-select"
            value={selectedMonth}
            label={t('reports.month_label')}
            onChange={(e) => setSelectedMonth(e.target.value as string)}
          >
            {months.map(month => (
              <MenuItem key={month} value={month}>{t(`reports.months.${month}`)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </FilterContainer>

      {filteredReports.length === 0 ? (
        <NoReports>{t('reports.no_reports')}</NoReports>
      ) : (
        <>
          <div className="mobile-reports">
            {filteredReports.map((report, index) => (
              <ReportCard key={`${report.categoryId}-${index}`}>
                <ReportCardItem>
                  <strong>{t('reports.category')}</strong> {report.categoryName}
                </ReportCardItem>
                <ReportCardItem>
                  <strong>{t('reports.start')}</strong> {formatDateTime(report.startTime, language)}
                </ReportCardItem>
                <ReportCardItem>
                  <strong>{t('reports.end')}</strong> {formatDateTime(report.endTime, language)}
                </ReportCardItem>
                <ReportCardItem>
                  <strong>{t('reports.duration')}</strong> {formatTime(report.duration)}
                </ReportCardItem>
                <ReportCardItem>
                  <strong>{t('reports.earnings')}</strong> {formatMoney((report.duration / 3600) * (report.hourlyRate || 0), currency, language)}
                </ReportCardItem>
                <ReportCardItem>
                  <DeleteButton onClick={() => handleDelete(index)}>{t('reports.delete_button')}</DeleteButton>
                </ReportCardItem>
              </ReportCard>
            ))}
            <StatsContainer>
              <ReportCardItem>
                <strong>{t('reports.total')}</strong> {formatTime(totalTime)} ({formatMoney(totalEarnedAmount, currency, language)})
              </ReportCardItem>
              <ReportCardItem>
                <strong>{t('reports.week_total')}</strong> {formatTime(weekTime)} ({formatMoney(weekEarnedAmount, currency, language)})
              </ReportCardItem>
              <ReportCardItem>
                <strong>{t('reports.month_total')}</strong> {formatTime(monthTime)} ({formatMoney(monthEarnedAmount, currency, language)})
              </ReportCardItem>
              <ReportCardItem>
                <strong>{t('reports.year_total')}</strong> {formatTime(yearTime)} ({formatMoney(yearEarnedAmount, currency, language)})
              </ReportCardItem>
              <ReportCardItem>
                <strong>{t('reports.avg_day')}</strong> {formatTime(avgDay)} ({formatMoney(avgDayEarned, currency, language)})
              </ReportCardItem>
              <ReportCardItem>
                <strong>{t('reports.max_day')}</strong> {formatTime(maxDay)} ({formatMoney(maxDayEarned, currency, language)})
              </ReportCardItem>
              <ReportCardItem>
                <strong>{t('reports.min_day')}</strong> {formatTime(minDay)} ({formatMoney(minDayEarned, currency, language)})
              </ReportCardItem>
              <ReportCardItem>
                <strong>{t('reports.forecast')}</strong> {formatTime(forecast)} ({formatMoney(forecastEarned, currency, language)})
              </ReportCardItem>
            </StatsContainer>
          </div>
          <ReportTable className="desktop-reports">
            <thead>
              <tr>
                <ReportCell>{t('reports.category')}</ReportCell>
                <ReportCell>{t('reports.start')}</ReportCell>
                <ReportCell>{t('reports.end')}</ReportCell>
                <ReportCell>{t('reports.duration')}</ReportCell>
                <ReportCell>{t('reports.earnings')}</ReportCell>
                <ReportCell></ReportCell>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => (
                <ReportRow key={`${report.categoryId}-${index}`}>
                  <ReportCell>{report.categoryName}</ReportCell>
                  <ReportCell>{formatDateTime(report.startTime, language)}</ReportCell>
                  <ReportCell>{formatDateTime(report.endTime, language)}</ReportCell>
                  <ReportCell>{formatTime(report.duration)}</ReportCell>
                  <ReportCell>{formatMoney((report.duration / 3600) * (report.hourlyRate || 0), currency, language)}</ReportCell>
                  <ReportCell>
                    <DeleteButton onClick={() => handleDelete(index)}>{t('reports.delete_button')}</DeleteButton>
                  </ReportCell>
                </ReportRow>
              ))}
              <TotalRow>
                <TotalCell>{t('reports.total')}</TotalCell>
                <TotalCell></TotalCell>
                <TotalCell></TotalCell>
                <TotalCell>{formatTime(totalTime)}</TotalCell>
                <TotalCell>{formatMoney(totalEarnedAmount, currency, language)}</TotalCell>
                <TotalCell></TotalCell>
              </TotalRow>
              <TotalRow>
                <TotalCell>{t('reports.week_total')}</TotalCell>
                <TotalCell></TotalCell>
                <TotalCell></TotalCell>
                <TotalCell>{formatTime(weekTime)}</TotalCell>
                <TotalCell>{formatMoney(weekEarnedAmount, currency, language)}</TotalCell>
                <TotalCell></TotalCell>
              </TotalRow>
              <TotalRow>
                <TotalCell>{t('reports.month_total')}</TotalCell>
                <TotalCell></TotalCell>
                <TotalCell></TotalCell>
                <TotalCell>{formatTime(monthTime)}</TotalCell>
                <TotalCell>{formatMoney(monthEarnedAmount, currency, language)}</TotalCell>
                <TotalCell></TotalCell>
              </TotalRow>
              <TotalRow>
                <TotalCell>{t('reports.year_total')}</TotalCell>
                <TotalCell></TotalCell>
                <TotalCell></TotalCell>
                <TotalCell>{formatTime(yearTime)}</TotalCell>
                <TotalCell>{formatMoney(yearEarnedAmount, currency, language)}</TotalCell>
                <TotalCell></TotalCell>
              </TotalRow>
              <TotalRow>
                <TotalCell>{t('reports.avg_day')}</TotalCell>
                <TotalCell></TotalCell>
                <TotalCell></TotalCell>
                <TotalCell>{formatTime(avgDay)}</TotalCell>
                <TotalCell>{formatMoney(avgDayEarned, currency, language)}</TotalCell>
                <TotalCell></TotalCell>
              </TotalRow>
              <TotalRow>
                <TotalCell>{t('reports.max_day')}</TotalCell>
                <TotalCell></TotalCell>
                <TotalCell></TotalCell>
                <TotalCell>{formatTime(maxDay)}</TotalCell>
                <TotalCell>{formatMoney(maxDayEarned, currency, language)}</TotalCell>
                <TotalCell></TotalCell>
              </TotalRow>
              <TotalRow>
                <TotalCell>{t('reports.min_day')}</TotalCell>
                <TotalCell></TotalCell>
                <TotalCell></TotalCell>
                <TotalCell>{formatTime(minDay)}</TotalCell>
                <TotalCell>{formatMoney(minDayEarned, currency, language)}</TotalCell>
                <TotalCell></TotalCell>
              </TotalRow>
              <TotalRow>
                <TotalCell>{t('reports.forecast')}</TotalCell>
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