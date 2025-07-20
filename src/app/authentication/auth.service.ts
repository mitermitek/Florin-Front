import { computed, inject, Injectable, signal } from '@angular/core';
import {
  RegisterData,
  UserData,
  LoginData,
  UserAuthenticatedData,
} from './auth.data';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/v1/auth`;
  private user = signal<UserAuthenticatedData | null>(
    this.getUserFromStorage()
  );

  currentUser = this.user.asReadonly();
  isAuthenticated = computed(() => this.user() !== null);

  register(data: RegisterData): Observable<UserData> {
    return this.httpClient.post<UserData>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginData): Observable<UserAuthenticatedData> {
    return this.httpClient
      .post<UserAuthenticatedData>(`${this.apiUrl}/login`, data)
      .pipe(
        tap((response) => {
          this.user.set(response);
          this.saveUserToStorage(response);
        })
      );
  }

  logout(): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/logout`).pipe(
      tap(() => {
        this.user.set(null);
        this.clearUserFromStorage();
      })
    );
  }

  private getUserFromStorage(): UserAuthenticatedData | null {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  private saveUserToStorage(user: UserAuthenticatedData): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  private clearUserFromStorage(): void {
    sessionStorage.removeItem('user');
  }
}
