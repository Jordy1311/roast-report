import { Routes } from '@angular/router';

import { isLoggedInGuard } from './guards/is-logged-in.guard';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [isLoggedInGuard],
    title: 'Roast Report',
    pathMatch: 'full',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Roast Report | Register',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Roast Report | Login',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'Roast Report | Not Found',
  },
];
