import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import {
  CategoryData,
  CategoryFiltersData,
  CreateUpdateCategoryData,
  PaginatedCategoriesData,
} from './category.data';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private httpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/UserCategories`;

  getCategories(
    page: number = 1,
    size: number = 10,
    filters: CategoryFiltersData = {}
  ): Observable<PaginatedCategoriesData> {
    let params = new HttpParams().set('Page', page.toString()).set('Size', size.toString());

    if (filters.name) {
      params = params.set('Name', filters.name);
    }

    return this.httpClient.get<PaginatedCategoriesData>(this.apiUrl, { params });
  }

  getCategoryById(id: string): Observable<CategoryData> {
    return this.httpClient.get<CategoryData>(`${this.apiUrl}/${id}`);
  }

  createCategory(category: CreateUpdateCategoryData): Observable<CategoryData> {
    return this.httpClient.post<CategoryData>(this.apiUrl, category);
  }

  updateCategory(id: string, category: CreateUpdateCategoryData): Observable<CategoryData> {
    return this.httpClient.put<CategoryData>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
