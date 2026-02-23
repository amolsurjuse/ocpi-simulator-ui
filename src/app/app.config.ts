import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { API_BASE_URL } from './core/tokens';

function resolveApiBaseUrl(): string {
  const locationOrigin = globalThis?.location?.origin;
  if (locationOrigin && locationOrigin !== 'null') {
    return `${locationOrigin}/ocpp-simulator`;
  }
  return 'http://localhost:8081';
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: API_BASE_URL, useFactory: resolveApiBaseUrl }
  ]
};
