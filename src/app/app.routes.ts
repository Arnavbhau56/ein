import { Routes } from '@angular/router';
import { Main } from '../pages/main/main';
import { Register } from '../pages/register/register';
import { Login } from '../pages/login/login';
import { Reset } from '../pages/reset/reset';
import { Dashboard } from '../pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Main },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'reset-password', component: Reset },
  { path: 'dashboard', component: Dashboard }
];
