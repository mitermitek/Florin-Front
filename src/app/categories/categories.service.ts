import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { CategoriesPaginatedData, CategoryData, CategoryFormData } from './category.data';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private httpClient = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/v1/user/categories`;

  getCategories(page: number, name?: string): Observable<CategoriesPaginatedData> {
    let params = `page=${page}`;
    if (name) {
      params += `&name=${encodeURIComponent(name)}`;
    }
    return this.httpClient.get<CategoriesPaginatedData>(`${this.apiUrl}?${params}`);
  }

  // Method for searching categories without triggering the loader
  searchCategories(page: number, name?: string): Observable<CategoriesPaginatedData> {
    let params = `page=${page}`;
    if (name) {
      params += `&name=${encodeURIComponent(name)}`;
    }

    const headers = new HttpHeaders().set('skip-loading', 'true');
    return this.httpClient.get<CategoriesPaginatedData>(`${this.apiUrl}?${params}`, { headers });
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
