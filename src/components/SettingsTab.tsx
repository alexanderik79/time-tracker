// src/components/SettingsTab.tsx

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { setSettings } from '../features/settings/settingsSlice';
import { SettingsContainer, FormGroup, Label, Input, Select, Button } from '../styles/SettingsTabStyles'; // <--- Импортируем стилизованные компоненты

interface SettingsFormData {
  name: string;
  phoneNumber: string;
  hourlyRate: number;
  currency: string;
  language: string;
}

const SettingsTab: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const currentSettings = useSelector((state: RootState) => state.settings);

  const { register, handleSubmit, reset } = useForm<SettingsFormData>({
    defaultValues: currentSettings,
  });

  useEffect(() => {
    reset(currentSettings);
  }, [currentSettings, reset]);

  const onSubmit = (data: SettingsFormData) => {
    dispatch(setSettings(data));
    alert('Настройки сохранены!');
  };

  return (
    <SettingsContainer> {/* <--- Используем стилизованный контейнер */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup> {/* <--- Используем стилизованную группу формы */}
          <Label htmlFor="name">Имя:</Label> {/* <--- Используем стилизованный лейбл */}
          <Input id="name" type="text" {...register('name')} /> {/* <--- Используем стилизованный инпут */}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="phoneNumber">Номер телефона:</Label>
          <Input id="phoneNumber" type="text" {...register('phoneNumber')} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="hourlyRate">Зарплата в час:</Label>
          <Input id="hourlyRate" type="number" step="0.01" {...register('hourlyRate', { valueAsNumber: true })} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="currency">Валюта:</Label>
          <Select id="currency" {...register('currency')}> {/* <--- Используем стилизованный селект */}
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
        <Button type="submit">Сохранить</Button> {/* <--- Используем стилизованную кнопку */}
      </form>
    </SettingsContainer>
  );
};

export default SettingsTab;