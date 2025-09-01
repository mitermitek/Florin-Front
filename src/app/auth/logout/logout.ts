import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-logout',
  imports: [RouterLink],
  templateUrl: './logout.html',
  styleUrl: './logout.scss',
})
export class Logout implements OnInit {
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.authService
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Logout successful',
            detail: 'You are now logged out',
          });
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
