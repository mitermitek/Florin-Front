import { Component, inject } from '@angular/core';
import { LoginForm } from './login-form/login-form';
import { LoginFormData } from './login-form/login-form.data';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  imports: [LoginForm],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);

  onLoginSubmit(formData: LoginFormData) {
    this.authService.login(formData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }
}
