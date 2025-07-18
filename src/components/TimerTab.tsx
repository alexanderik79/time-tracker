// src/components/TimerTab.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { AppDispatch, RootState } from '../store';
import type { SelectChangeEvent } from '@mui/material/Select';
import { startTimer, stopTimer, selectCategory } from '../features/timeTracker/CategorySlice'; 
import { TimerContainer, CategoryItem, TimeDisplay, StartButton, StopButton } from '../styles/TimerTabStyles';
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

const formatMoney = (amount: number, currency: string, language: string): string => {
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const TimerTab: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
  const categories = useSelector((state: RootState) => state.timeTracker?.categories || []);
  const lastSelectedCategoryId = useSelector((state: RootState) => state.timeTracker?.lastSelectedCategory || '');
  const selectedCategory = categories.find(cat => cat.id === lastSelectedCategoryId) || null;
  
  const settings = useSelector((state: RootState) => state.settings);
  const { currency, language } = settings; 

  const [displayTime, setDisplayTime] = useState(0);
  const [localSelectedValue, setLocalSelectedValue] = useState<string>(lastSelectedCategoryId || '');
  const intervalRef = useRef<number | undefined>(undefined);

  const earnedAmount = (displayTime / 3600) * (selectedCategory?.hourlyRate || 0);

  useEffect(() => {
    if (lastSelectedCategoryId && lastSelectedCategoryId !== localSelectedValue) {
      setLocalSelectedValue(lastSelectedCategoryId);
    } else if (!lastSelectedCategoryId && categories.length > 0 && !localSelectedValue) {
      dispatch(selectCategory(categories[0].id));
      setLocalSelectedValue(categories[0].id);
    } else if (!lastSelectedCategoryId && !categories.length && localSelectedValue) {
      setLocalSelectedValue('');
    }
  }, [lastSelectedCategoryId, categories, dispatch, localSelectedValue]);

  useEffect(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = undefined;

    if (selectedCategory?.running && selectedCategory.startTime !== null) {
      const elapsed = Math.floor((Date.now() - selectedCategory.startTime) / 1000);
      setDisplayTime(elapsed);
      intervalRef.current = window.setInterval(() => {
        setDisplayTime(prev => prev + 1);
      }, 1000);
    } else {
      setDisplayTime(0);
    }

    return () => clearInterval(intervalRef.current);
  }, [selectedCategory?.id, selectedCategory?.running, selectedCategory?.startTime]);

  const handleSelectCategory = (e: SelectChangeEvent<string>) => {
    setLocalSelectedValue(e.target.value);
    dispatch(selectCategory(e.target.value));
  };

  const handleStart = () => {
    if (selectedCategory) {
      dispatch(startTimer(selectedCategory.id));
      setDisplayTime(0);
    }
  };

  const handleStop = () => {
    if (selectedCategory) {
      dispatch(stopTimer());
      setDisplayTime(0); 
    }
  };

  return (
    <TimerContainer>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="month-select-label" className="inputLabel-cust">{t('timer.work_label')}</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          label={t('timer.work_label')}
          className="select-cust"
          value={localSelectedValue}
          onChange={handleSelectCategory}
          disabled={selectedCategory?.running || false}
        >
          <MenuItem value="" disabled>{t('timer.select_employer')}</MenuItem>
          {categories.map(category => (
            <MenuItem key={category.id} value={category.id}>
              {category.name} ({formatMoney(category.hourlyRate, currency, language)}/час)
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {categories.length === 0 && <p style={{ color: '#f1f1f1' }}>{t('timer.no_categories')}</p>}
      {localSelectedValue && (
        <CategoryItem>
          {selectedCategory?.running ? (
            <StopButton onClick={handleStop}>
              <TimeDisplay running={selectedCategory.running.toString()}>
                {formatTime(displayTime)}
              </TimeDisplay>
              <span style={{ fontSize: '1.2rem', color: '#f1f1f1' }}>
                {formatMoney(earnedAmount, currency, language)}
              </span>
            </StopButton>
          ) : (
            <StartButton onClick={handleStart} disabled={!selectedCategory}>
              <TimeDisplay running={selectedCategory?.running.toString() || 'false'}>
                {formatTime(displayTime)}
              </TimeDisplay>
              <span style={{ fontSize: '1.2rem', color: '#f1f1f1' }}>
                {formatMoney(earnedAmount, currency, language)}
              </span>
            </StartButton>
          )}
        </CategoryItem>
      )}
      {selectedCategory && (
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #333', color: '#f1f1f1' }}>
          <p>{t('timer.total_time')}: {formatTime(selectedCategory.time)}</p>
          <p>{t('timer.total_earnings')}: {formatMoney((selectedCategory.time / 3600) * (selectedCategory.hourlyRate || 0), currency, language)}</p>
        </div>
      )}
    </TimerContainer>
  );
};

export default TimerTab;