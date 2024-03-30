import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { jwtInterceptorInterceptor } from './interceptors/jwt-interceptor.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withInterceptors([ jwtInterceptorInterceptor ])),
  ]
};
