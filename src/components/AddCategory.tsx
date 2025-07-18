import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { addCategory, deleteCategory, updateCategory } from '../features/timeTracker/CategorySlice';
// Исправленные импорты стилей: теперь EditButton импортируется из файла стилей
import { FormContainer, Input, Button, CategoryList, CategoryItem, CategoryName, DeleteButton, EditButton } from '../styles/AddCategoryStyles';
// import styled from 'styled-components'; // Эту строку теперь можно УДАЛИТЬ

const AddCategory: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.timeTracker.categories);
  const [categoryName, setCategoryName] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingHourlyRate, setEditingHourlyRate] = useState<number>(0);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim() && hourlyRate >= 0) {
      dispatch(addCategory({ name: categoryName.trim(), hourlyRate: hourlyRate }));
      setCategoryName('');
      setHourlyRate(0);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию и все связанные с ней отчёты?')) {
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
          placeholder="Название категории"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Зарплата в час"
          value={hourlyRate === 0 ? '' : hourlyRate}
          onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
          step="0.01"
          min="0"
          required
        />
        <Button type="submit">Добавить категорию</Button>
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
                  onChange={(e) => setEditingHourlyRate(parseFloat(e.target.value))}
                  step="0.01"
                  min="0"
                />
                <Button onClick={handleSaveEdit}>Сохранить</Button>
                <DeleteButton onClick={handleCancelEdit}>Отмена</DeleteButton>
              </>
            ) : (
              <>
                <CategoryName>{category.name} ({category.hourlyRate} за час)</CategoryName>
                <EditButton onClick={() => handleEditClick(category)}>Редактировать</EditButton>
                <DeleteButton onClick={() => handleDeleteCategory(category.id)}>Удалить</DeleteButton>
              </>
            )}
          </CategoryItem>
        ))}
      </CategoryList>
    </div>
  );
};

export default AddCategory;