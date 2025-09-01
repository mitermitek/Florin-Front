import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, MenubarModule, MenuModule, ButtonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  private readonly authService = inject(AuthService);

  private readonly authenticatedMenuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: '/',
    },
    {
      label: 'Transactions',
      icon: 'pi pi-wallet',
      routerLink: '/transactions',
    },
    {
      label: 'Categories',
      icon: 'pi pi-list',
      routerLink: '/categories',
    },
  ];
  private readonly authenticatedUserItems: MenuItem[] = [
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      routerLink: '/auth/logout',
    },
  ];

  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly navigationMenuItems = computed(() =>
    this.isAuthenticated() ? this.authenticatedMenuItems : []
  );
  readonly userMenuItems = computed(() =>
    this.isAuthenticated() ? this.authenticatedUserItems : []
  );
}
