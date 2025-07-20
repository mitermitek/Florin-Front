import { CategoryData } from '../categories/category.data';

export interface TransactionData {
  id: number;
  type: Type;
  date: string; // YYYY-MM-DD format
  amount: number;
  description?: string;
  category: CategoryData;
}

export interface TransactionFormData {
  type: Type;
  date: string; // YYYY-MM-DD format
  amount: number;
  description?: string;
  category_id: number;
}

export enum Type {
  EXPENSE = 'expense',
  INCOME = 'income',
}
