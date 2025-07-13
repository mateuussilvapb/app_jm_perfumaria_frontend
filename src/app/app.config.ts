//Angular
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

//Externos
import { includeBearerTokenInterceptor } from 'keycloak-angular';
import { ConfirmationService, MessageService } from 'primeng/api';

//Internos
import { routes } from './app.routes';
import { PRIMENG_PROVIDER } from './config/providers/primeng.provider';
import { KEYCLOAK_PROVIDERS } from './config/providers/keycloak.provider';
import { INTERCEPTORS_PROVIDERS } from './config/providers/interceptors.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([includeBearerTokenInterceptor]),
      withInterceptorsFromDi()
    ),
    ...INTERCEPTORS_PROVIDERS,
    PRIMENG_PROVIDER,
    ...KEYCLOAK_PROVIDERS,
    MessageService,
    ConfirmationService,
  ],
};
