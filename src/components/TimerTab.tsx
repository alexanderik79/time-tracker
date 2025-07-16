import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { startTimer, stopTimer, updateTime, syncTime, selectCategory } from '../features/timeTracker/CategorySlice';
import { TimerContainer, Select, CategoryItem, TimeDisplay, StartButton, StopButton } from '../styles/TimerTabStyles';

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const TimerTab: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.timeTracker?.categories || []);
  const lastSelectedCategory = useSelector((state: RootState) => state.timeTracker?.lastSelectedCategory || null);
  const selectedCategory = categories.find(cat => cat.id === lastSelectedCategory);
  const [displayTime, setDisplayTime] = useState(0);
  const intervalRef = useRef<number | null>(null);

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

  const handleSelectCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
      <Select
        value={lastSelectedCategory || ''}
        onChange={handleSelectCategory}
        disabled={!categories.length || selectedCategory?.running}
      >
        <option value="" disabled>Выберите работодателя</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
      {categories.length === 0 && <p style={{ color: '#f1f1f1' }}>Нет категорий. Добавьте в вкладке "Категории".</p>}
      {selectedCategory && (
        <CategoryItem>
          <div>
            {!selectedCategory.running && !selectedCategory.paused ? (
              <StartButton onClick={handleStart}>
                <TimeDisplay running={selectedCategory.running.toString()}>
                  {formatTime(selectedCategory.time)}
                </TimeDisplay>
              </StartButton>
            ) : (
              <StopButton onClick={handleStop}>
                <TimeDisplay running={selectedCategory.running.toString()}>
                  {formatTime(selectedCategory.running ? displayTime : selectedCategory.time)}
                </TimeDisplay>
              </StopButton>
            )}
          </div>
        </CategoryItem>
      )}
    </TimerContainer>
  );
};

export default TimerTab;