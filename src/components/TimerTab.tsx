// src/components/TimerTab.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import type { SelectChangeEvent } from '@mui/material/Select';
import { startTimer, stopTimer, updateTime, syncTime, selectCategory } from '../features/timeTracker/CategorySlice';
import { TimerContainer, CategoryItem, TimeDisplay, StartButton, StopButton } from '../styles/TimerTabStyles'; // Import the updated styled components

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
  const categories = useSelector((state: RootState) => state.timeTracker?.categories || []);
  const lastSelectedCategory = useSelector((state: RootState) => state.timeTracker?.lastSelectedCategory || null);
  const selectedCategory = categories.find(cat => cat.id === lastSelectedCategory);
  
  const settings = useSelector((state: RootState) => state.settings);
  const { hourlyRate, currency, language } = settings;

  const [displayTime, setDisplayTime] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const earnedAmount = (displayTime / 3600) * hourlyRate;

  useEffect(() => {
    dispatch(syncTime());
    if (selectedCategory) {
      setDisplayTime(selectedCategory.time);
      if (selectedCategory.running && selectedCategory.startTime) {
        const elapsed = Math.floor((Date.now() - selectedCategory.startTime) / 1000);
        setDisplayTime(selectedCategory.time + elapsed);
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          setDisplayTime(prev => prev + 1);
        }, 1000);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDisplayTime(selectedCategory.time);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dispatch, selectedCategory?.id, selectedCategory?.running, selectedCategory?.time]);

  const handleSelectCategory = (e: SelectChangeEvent<string>) => {
    if (selectedCategory?.running && selectedCategory.startTime) {
      dispatch(updateTime({ id: selectedCategory.id }));
    }
    dispatch(selectCategory(e.target.value));
  };

  const handleStart = () => {
    if (selectedCategory) {
      dispatch(startTimer(selectedCategory.id));
      setDisplayTime(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setDisplayTime(prev => prev + 1);
      }, 1000);
    }
  };

  const handleStop = () => {
    if (selectedCategory && (selectedCategory.running || selectedCategory.paused)) {
      if (selectedCategory.running && selectedCategory.startTime) {
        dispatch(updateTime({ id: selectedCategory.id }));
      }
      dispatch(stopTimer(selectedCategory.id));
      setDisplayTime(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  return (
    <TimerContainer>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="month-select-label" className="inputLabel-cust">Work</InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          label="Work"
          className="select-cust"
          value={lastSelectedCategory || ''}
          onChange={handleSelectCategory}
          disabled={!categories.length || selectedCategory?.running}
        >
          <MenuItem value="" disabled>Выберите работодателя</MenuItem>
          {categories.map(category => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {categories.length === 0 && <p style={{ color: '#f1f1f1' }}>Нет категорий. Добавьте в вкладке "Категории".</p>}
      {selectedCategory && (
        <CategoryItem>
          {/* We've already set flex-direction: column on StartButton/StopButton */}
          {/* and display: block on TimeDisplay, so they'll stack automatically. */}
          {/* We can remove the redundant <div> wrapper here. */}
          {!selectedCategory.running && !selectedCategory.paused ? (
            <StartButton onClick={handleStart}>
              <TimeDisplay running={selectedCategory.running.toString()}>
                {formatTime(selectedCategory.time)}
              </TimeDisplay>
              <span style={{ fontSize: '1.2rem', color: '#f1f1f1' /* Removed marginTop here */ }}>
                  {formatMoney((selectedCategory.time / 3600) * hourlyRate, currency, language)}
              </span>
            </StartButton>
          ) : (
            <StopButton onClick={handleStop}>
              <TimeDisplay running={selectedCategory.running.toString()}>
                {formatTime(selectedCategory.running ? displayTime : selectedCategory.time)}
              </TimeDisplay>
              <span style={{ fontSize: '1.2rem', color: '#f1f1f1' /* Removed marginTop here */ }}>
                  {formatMoney(earnedAmount, currency, language)}
              </span>
            </StopButton>
          )}
        </CategoryItem>
      )}
    </TimerContainer>
  );
};

export default TimerTab;