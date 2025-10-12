import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTOR_PROVIDERS } from './core/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    ...HTTP_INTERCEPTOR_PROVIDERS,
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi())
  ]
};
