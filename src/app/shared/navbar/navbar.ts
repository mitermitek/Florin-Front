import { Component, DestroyRef, inject, signal } from '@angular/core';
import { AuthService } from '../../authentication/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../toast/toast.service';
import {
  LucideAngularModule,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from 'lucide-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule, LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  readonly LogOutIcon = LogOutIcon;
  readonly MenuIcon = MenuIcon;
  readonly XIcon = XIcon;

  isMenuOpen = signal(false);

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  logout() {
    this.authService
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Logging out successfully!');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.toastService.showError('Error while logging out!');
        },
      });
  }
}
