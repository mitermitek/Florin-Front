import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { CategoriesPaginatedData, CategoryData, CategoryFormData } from './category.data';
import { CategoryFiltersData } from './category-filters/category-filters';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private httpClient = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/user/categories`;

  getCategories(page: number, filters?: CategoryFiltersData): Observable<CategoriesPaginatedData> {
    let params = `page=${page}`;

    if (filters?.name) {
      params += `&name=${encodeURIComponent(filters.name)}`;
    }

    return this.httpClient.get<CategoriesPaginatedData>(`${this.apiUrl}?${params}`);
  }

  createCategory(data: CategoryFormData): Observable<CategoryData> {
    return this.httpClient.post<CategoryData>(`${this.apiUrl}`, data);
  }

  updateCategory(id: number, data: CategoryFormData): Observable<CategoryData> {
    return this.httpClient.put<CategoryData>(`${this.apiUrl}/${id}`, data);
  }

  deleteCategory(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
