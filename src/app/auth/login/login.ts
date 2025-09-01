import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { LoginData } from '../auth.data';
import { AuthService } from '../auth.service';
import { LoginForm } from './login-form/login-form';

@Component({
  selector: 'app-login',
  imports: [PanelModule, LoginForm, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  onLoginSubmit(data: LoginData) {
    this.authService
      .login(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Connection successful',
            detail: 'You are now logged in',
          });
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: err.statusText,
            detail: err.error.message,
          });
        },
      });
  }
}
