import { Routes } from '@angular/router';

import { isLoggedInGuard } from './guards/is-logged-in.guard';

import { ConfirmLoginComponent } from './components/confirm-login/confirm-login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Roast Report | Login',
    pathMatch: 'full',
  },
  {
    path: 'confirm-login/:confirmationCode',
    component: ConfirmLoginComponent,
    title: 'Roast Report | Confirm Login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [isLoggedInGuard],
    title: 'Roast Report',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'Roast Report | Not Found',
  },
];
