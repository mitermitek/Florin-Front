import { CategoryData } from '../categories/category.data';
import {
  PaginationLinks,
  PaginationMeta,
} from '../shared/pagination/pagination.data';

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

export interface TransactionsPaginatedData {
  data: TransactionData[];
  links: PaginationLinks;
  meta: PaginationMeta;
}
