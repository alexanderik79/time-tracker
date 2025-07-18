// src/styles/AddCategoryStyles.ts

import styled from 'styled-components';
import { colors } from './GlobalStyles';

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 16px;
`;

export const Input = styled.input`
  padding: 8px;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  background-color: ${colors.card};
  color: ${colors.text};
  &::placeholder {
    color: ${colors.textSecondary};
  }
`;

export const Button = styled.button`
  padding: 8px;
  font-size: 0.9rem;
  background-color: ${colors.primary};
  color: ${colors.text};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  animation: scale 0.2s ease-in-out;
  &:hover {
    background-color: ${colors.primaryHover};
  }
`;

export const CategoryList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CategoryItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: ${colors.card};
  border-radius: 4px;
  animation: slideIn 0.3s ease-in-out;
`;

export const CategoryName = styled.span`
  font-size: 0.9rem;
  color: ${colors.text};
`;

export const DeleteButton = styled(Button)`
  background-color: ${colors.danger};
  color: ${colors.text};
`;

// НОВЫЙ СТИЛИЗОВАННЫЙ КОМПОНЕНТ EditButton
export const EditButton = styled(Button)`
  background-color: #007bff; /* Примерный синий цвет */
  color: white;
  margin-left: 8px; /* Небольшой отступ от CategoryName */
  &:hover {
    background-color: #0056b3;
  }
`;