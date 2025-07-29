import {
  PaginationLinks,
  PaginationMeta,
} from '../shared/pagination/pagination.data';

export interface CategoryData {
  id: number;
  name: string;
}

export interface CategoryFormData {
  name: string;
}

export interface CategoriesPaginatedData {
  data: CategoryData[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface CategoryFiltersData {
  name?: string;
}
