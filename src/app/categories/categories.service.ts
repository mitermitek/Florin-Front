import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { CategoryData, CategoryFormData } from './category.data';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private httpClient = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/v1/user/categories`;

  getCategories(): Observable<CategoryData[]> {
    return this.httpClient.get<CategoryData[]>(`${this.apiUrl}`);
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
