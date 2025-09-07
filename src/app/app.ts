import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Footer } from './shared/footer/footer';
import { Menu } from './shared/menu/menu';
import { AuthService } from './auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, Footer, Toast, ConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.authService.status().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
