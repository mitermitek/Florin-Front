import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, MenubarModule, AvatarModule ],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit(): void {
    this.items = [
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
  }
}
