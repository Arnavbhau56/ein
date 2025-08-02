import { Routes } from '@angular/router';
import { Main } from '../pages/main/main';
import { Register } from '../pages/register/register';

export const routes: Routes = [
  { path: '', component: Main },
  { path: 'register', component: Register }
];
