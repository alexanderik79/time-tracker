// src/components/SettingsTab.tsx

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { setSettings } from '../features/settings/settingsSlice';
import { SettingsContainer, FormGroup, Label, Input, Select, Button } from '../styles/SettingsTabStyles';

interface SettingsFormData {
  name: string;
  phoneNumber: string;
  // hourlyRate: number; // <--- УДАЛИТЬ ЭТУ СТРОКУ
  currency: string;
  language: string;
}

const SettingsTab: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const currentSettings = useSelector((state: RootState) => state.settings);

  // Используем Omit<SettingsFormData, 'hourlyRate'>, чтобы TypeScript не ругался
  // на отсутствие hourlyRate в currentSettings, так как мы его удалили из settingsSlice.
  const { register, handleSubmit, reset } = useForm<Omit<SettingsFormData, 'hourlyRate'>>({
    defaultValues: currentSettings,
  });

  useEffect(() => {
    reset(currentSettings);
  }, [currentSettings, reset]);

  const onSubmit = (data: Omit<SettingsFormData, 'hourlyRate'>) => { // <--- Изменено на Omit
    dispatch(setSettings(data)); // Data теперь не содержит hourlyRate
    alert('Настройки сохранены!');
  };

  return (
    <SettingsContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="name">Имя:</Label>
          <Input id="name" type="text" {...register('name')} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="phoneNumber">Номер телефона:</Label>
          <Input id="phoneNumber" type="text" {...register('phoneNumber')} />
        </FormGroup>
        {/* <FormGroup> // <--- УДАЛИТЬ ЭТОТ БЛОК ПОЛЯ ЗАРПЛАТЫ
          <Label htmlFor="hourlyRate">Зарплата в час:</Label>
          <Input id="hourlyRate" type="number" step="0.01" {...register('hourlyRate', { valueAsNumber: true })} />
        </FormGroup> */}
        <FormGroup>
          <Label htmlFor="currency">Валюта:</Label>
          <Select id="currency" {...register('currency')}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="UAH">UAH</option>
            {/* Добавьте другие валюты по желанию */}
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="language">Язык:</Label>
          <Select id="language" {...register('language')}>
            <option value="uk">Українська</option>
            <option value="en">English</option>
            {/* Добавьте другие языки по желанию */}
          </Select>
        </FormGroup>
        <br></br>
        <Button type="submit">Сохранить</Button>
      </form>
    </SettingsContainer>
  );
};

export default SettingsTab;