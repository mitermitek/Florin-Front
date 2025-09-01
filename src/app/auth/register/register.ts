import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { RegisterData } from '../auth.data';
import { AuthService } from '../auth.service';
import { RegisterForm } from './register-form/register-form';

@Component({
  selector: 'app-register',
  imports: [PanelModule, RegisterForm, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  onRegisterSubmit(data: RegisterData) {
    this.authService
      .register(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Registration successful',
            detail: 'You are now registered and can log in',
          });
          this.router.navigate(['/auth/login']);
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
