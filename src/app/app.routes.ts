import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { isLoggedInGuard } from './guards/is-logged-in.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Roast Report | Login'
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [isLoggedInGuard],
    title: 'Roast Report'
  },
];
