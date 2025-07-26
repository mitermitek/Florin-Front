import { Component, DestroyRef, inject } from '@angular/core';
import { LoginForm } from './login-form/login-form';
import { AuthService } from '../auth.service';
import { LoginData } from '../auth.data';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../shared/toast/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [LoginForm, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  onLoginSubmit(data: LoginData) {
    this.authService
      .login(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Connected successfully!');
          this.router.navigate(['/']);
        },
        error: () => {
          this.toastService.showError('Error while connecting!');
        },
      });
  }
}
