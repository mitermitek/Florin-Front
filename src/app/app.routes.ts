import { Routes } from '@angular/router';
import { Login } from './authentication/login/login';
import { Register } from './authentication/register/register';
import { Home } from './home/home';
import { authGuard } from './authentication/auth-guard';
import { guestGuard } from './authentication/guest-guard';
import { Categories } from './categories/categories';
import { Transactions } from './transactions/transactions';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: '', component: Home, canActivate: [authGuard] },
  { path: 'categories', component: Categories, canActivate: [authGuard] },
  { path: 'transactions', component: Transactions, canActivate: [authGuard] },
  {
    path: '**',
    redirectTo: '/login',
  },
];
