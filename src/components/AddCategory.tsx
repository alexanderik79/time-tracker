import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { addCategory, deleteCategory } from '../features/timeTracker/CategorySlice';
import { FormContainer, Input, Button, CategoryList, CategoryItem, CategoryName, DeleteButton } from '../styles/AddCategoryStyles';

interface FormData {
  category: string;
}

const AddCategory: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.timeTracker.categories);
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { category: '' },
  });

  const onSubmit = (data: FormData) => {
    if (data.category.trim()) {
      dispatch(addCategory({ name: data.category.trim() }));
      reset();
    }
  };

  return (
    <div>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <Input placeholder="New employer (e.g., Rock Bar)" {...register('category', { required: true })} />
        <Button type="submit">Add Category</Button>
      </FormContainer>
      <CategoryList>
        {categories.map(category => (
          <CategoryItem key={category.id}>
            <CategoryName>{category.name}</CategoryName>
            <DeleteButton onClick={() => dispatch(deleteCategory(category.id))}>Delete</DeleteButton>
          </CategoryItem>
        ))}
      </CategoryList>
    </div>
  );
};

export default AddCategory;