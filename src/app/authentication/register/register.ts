import { Component, inject } from '@angular/core';
import { RegisterForm } from './register-form/register-form';
import { AuthService } from '../auth.service';
import { RegisterData } from '../auth.data';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-register',
  imports: [RegisterForm, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  onRegisterSubmit(data: RegisterData) {
    this.authService.register(data).subscribe({
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
