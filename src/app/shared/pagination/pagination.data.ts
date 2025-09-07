export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
