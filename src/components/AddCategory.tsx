// src/components/AddCategory.tsx

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { AppDispatch, RootState } from '../store';
import { addCategory, deleteCategory, updateCategory } from '../features/timeTracker/CategorySlice';
import { FormContainer, Input, Button, CategoryList, CategoryItem, CategoryName, DeleteButton, EditButton } from '../styles/AddCategoryStyles';

const AddCategory: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { t } = useTranslation();
  const categories = useSelector((state: RootState) => state.timeTracker.categories);
  const { currency, language } = useSelector((state: RootState) => state.settings);
  const [categoryName, setCategoryName] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingHourlyRate, setEditingHourlyRate] = useState<number>(0);

  const formatMoney = (amount: number): string => {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim() && hourlyRate >= 0) {
      dispatch(addCategory({ name: categoryName.trim(), hourlyRate }));
      setCategoryName('');
      setHourlyRate(0);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm(t('addCategory.delete_confirm'))) {
      dispatch(deleteCategory(id));
    }
  };

  const handleEditClick = (category: { id: string; name: string; hourlyRate: number }) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.name);
    setEditingHourlyRate(category.hourlyRate);
  };

  const handleSaveEdit = () => {
    if (editingCategoryId && editingCategoryName.trim() && editingHourlyRate >= 0) {
      dispatch(updateCategory({ id: editingCategoryId, name: editingCategoryName.trim(), hourlyRate: editingHourlyRate }));
      setEditingCategoryId(null);
      setEditingCategoryName('');
      setEditingHourlyRate(0);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
    setEditingHourlyRate(0);
  };

  return (
    <div style={{ padding: '16px' }}>
      <FormContainer onSubmit={handleAddCategory}>
        <Input
          type="text"
          placeholder={t('addCategory.category_name_placeholder')}
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder={t('addCategory.hourly_rate_placeholder')}
          value={hourlyRate === 0 ? '' : hourlyRate}
          onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
          step="0.01"
          min="0"
          required
        />
        <Button type="submit">{t('addCategory.add_button')}</Button>
      </FormContainer>

      <CategoryList>
        {categories.map((category) => (
          <CategoryItem key={category.id}>
            {editingCategoryId === category.id ? (
              <>
                <Input
                  type="text"
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                />
                <Input
                  type="number"
                  value={editingHourlyRate}
                  onChange={(e) => setEditingHourlyRate(parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                />
                <Button onClick={handleSaveEdit}>{t('addCategory.save_button')}</Button>
                <DeleteButton onClick={handleCancelEdit}>{t('addCategory.cancel_button')}</DeleteButton>
              </>
            ) : (
              <>
                <CategoryName>{category.name} ({formatMoney(category.hourlyRate)}/h)</CategoryName>
                <EditButton onClick={() => handleEditClick(category)}>{t('addCategory.edit_button')}</EditButton>
                <DeleteButton onClick={() => handleDeleteCategory(category.id)}>{t('addCategory.delete_button')}</DeleteButton>
              </>
            )}
          </CategoryItem>
        ))}
      </CategoryList>
    </div>
  );
};

export default AddCategory;