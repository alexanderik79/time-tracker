// src/components/SettingsTab.tsx

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { AppDispatch, RootState } from '../store';
import { setSettings } from '../features/settings/settingsSlice';
import { SettingsContainer, FormGroup, Label, Input, Select, Button } from '../styles/SettingsTabStyles';
import i18n from '../i18n';

interface SettingsFormData {
  name: string;
  phoneNumber: string;
  currency: string;
  language: string;
}

const SettingsTab: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
  const currentSettings = useSelector((state: RootState) => state.settings);

  const { register, handleSubmit, reset } = useForm<SettingsFormData>({
    defaultValues: currentSettings,
  });

  useEffect(() => {
    reset(currentSettings);
    // Синхронизируем язык i18next с Redux при загрузке
    i18n.changeLanguage(currentSettings.language);
  }, [currentSettings, reset]);

  const onSubmit = (data: SettingsFormData) => {
    dispatch(setSettings(data));
    i18n.changeLanguage(data.language); // Обновляем язык в i18next
    alert(t('settings.saved_alert'));
  };

  return (
    <SettingsContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label htmlFor="name">{t('settings.name_label')}</Label>
          <Input id="name" type="text" {...register('name')} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="phoneNumber">{t('settings.phone_label')}</Label>
          <Input id="phoneNumber" type="text" {...register('phoneNumber')} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="currency">{t('settings.currency_label')}</Label>
          <Select id="currency" {...register('currency')}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="UAH">UAH</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="language">{t('settings.language_label')}</Label>
          <Select id="language" {...register('language')}>
            <option value="en">English</option>
            <option value="uk">Українська</option>
            <option value="pl">Polski</option>
            <option value="ru">Русский</option>
          </Select>
        </FormGroup>
        <br />
        <Button type="submit">{t('settings.save_button')}</Button>
      </form>
    </SettingsContainer>
  );
};

export default SettingsTab;