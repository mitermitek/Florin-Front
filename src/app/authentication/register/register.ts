import { Component, DestroyRef, inject } from '@angular/core';
import { RegisterForm } from './register-form/register-form';
import { AuthService } from '../auth.service';
import { RegisterData } from '../auth.data';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../shared/toast/toast.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  imports: [RegisterForm, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  onRegisterSubmit(data: RegisterData) {
    this.authService
      .register(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Registration successful!');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.toastService.showError('Error during registration!');
        },
      });
  }
}
