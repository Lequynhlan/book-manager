import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then((m) => m.RegisterComponent),
  },
  {
    path: 'books',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/book-list/book-list').then((m) => m.BookListComponent),
  },
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: '**', redirectTo: 'books' },
];
