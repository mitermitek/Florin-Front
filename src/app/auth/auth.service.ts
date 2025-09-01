import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LoginData, RegisterData, UserData } from './auth.data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Auth`;

  isAuthenticated = signal(this.getIsAuthenticatedFromSessionStorage());
  user = signal<UserData | null>(null);

  register(data: RegisterData): Observable<void> {
    return this.httpClient.post<void>(`${this.apiUrl}/Register`, data);
  }

  login(data: LoginData): Observable<UserData> {
    return this.httpClient.post<UserData>(`${this.apiUrl}/Login`, data).pipe(
      tap({
        next: (user) => {
          this.setAuthentication(true, user);
        },
      })
    );
  }

  logout(): Observable<void> {
    return this.httpClient
      .delete<void>(`${this.apiUrl}/Logout`)
      .pipe(tap(() => this.setAuthentication(false, null)));
  }

  status(): Observable<UserData> {
    return this.httpClient.get<UserData>(`${this.apiUrl}/Status`).pipe(
      tap({
        next: (user) => {
          this.setAuthentication(true, user);
        },
        error: () => this.setAuthentication(false, null),
      })
    );
  }

  private getIsAuthenticatedFromSessionStorage(): boolean {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  }

  private setIsAuthenticatedToSessionStorage(isAuthenticated: boolean): void {
    sessionStorage.setItem('isAuthenticated', String(isAuthenticated));
    this.isAuthenticated.set(isAuthenticated);
  }

  private setAuthentication(isAuthenticated: boolean, user: UserData | null): void {
    this.setIsAuthenticatedToSessionStorage(isAuthenticated);
    this.user.set(user);
  }
}
