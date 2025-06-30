import { inject, Injectable } from '@angular/core';
import { LoginDTO, LoggedInDTO } from './auth.dto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  login(loginDTO: LoginDTO): Observable<LoggedInDTO> {
    return this.httpClient.post<LoggedInDTO>(
      `${this.apiUrl}/auth/login`,
      loginDTO
    );
  }
}
