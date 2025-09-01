import { Routes } from '@angular/router';
import { authGuard } from './auth/auth-guard';
import { guestGuard } from './auth/guest-guard';
import { Login } from './auth/login/login';
import { Logout } from './auth/logout/logout';
import { Register } from './auth/register/register';
import { Home } from './home/home';

export const routes: Routes = [
  { path: 'auth/login', component: Login, canActivate: [guestGuard] },
  { path: 'auth/logout', component: Logout, canActivate: [authGuard] },
  { path: 'auth/register', component: Register, canActivate: [guestGuard] },
  { path: '', component: Home, canActivate: [authGuard] },
];
