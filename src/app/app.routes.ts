import { Routes } from '@angular/router';

import { isLoggedInGuard } from './guards/is-logged-in.guard';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Roast Report | Login',
    pathMatch: 'full',
  },
  {
    path: 'confirm-login/:confirmationCode',
    loadComponent: () => import('./components/confirm-login/confirm-login.component')
      .then(m => m.ConfirmLoginComponent),
    title: 'Roast Report | Confirm Login',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () => import('./components/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [isLoggedInGuard],
    title: 'Roast Report',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () => import('./components/page-not-found/page-not-found.component')
      .then(m => m.PageNotFoundComponent),
    title: 'Roast Report | Not Found',
  },
];
