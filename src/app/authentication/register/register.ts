import { Component, inject } from '@angular/core';
import { RegisterForm } from './register-form/register-form';
import { AuthService } from '../auth.service';
import { RegisterData } from '../auth.data';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RegisterForm, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private router = inject(Router);
  private authService = inject(AuthService);

  onRegisterSubmit(data: RegisterData) {
    this.authService.register(data).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Register failed:', error);
      },
    });
  }
}
