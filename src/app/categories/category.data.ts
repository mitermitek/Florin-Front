import { PaginatedData } from '../shared/pagination/pagination.data';

export interface CategoryData {
  id: string;
  name: string;
}

export interface CreateUpdateCategoryData {
  name: string;
}

export type PaginatedCategoriesData = PaginatedData<CategoryData>;
