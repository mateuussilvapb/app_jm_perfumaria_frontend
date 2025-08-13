// Angular
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideZoneChangeDetection,
  LOCALE_ID
} from '@angular/core';
import { provideRouter } from '@angular/router';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Externos
import { DialogService } from 'primeng/dynamicdialog';
import { includeBearerTokenInterceptor } from 'keycloak-angular';
import { ConfirmationService, MessageService } from 'primeng/api';

// Internos
import { routes } from './app.routes';
import { PRIMENG_PROVIDER } from '@config/providers/primeng.provider';
import { KEYCLOAK_PROVIDERS } from '@config/providers/keycloak.provider';
import { INTERCEPTORS_PROVIDERS } from '@config/providers/interceptors.provider';

// registra os dados de formatação do pt-BR
registerLocaleData(localePt, 'pt-BR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([includeBearerTokenInterceptor]),
      withInterceptorsFromDi()
    ),
    { provide: LOCALE_ID, useValue: 'pt-BR' }, // define o locale global
    ...INTERCEPTORS_PROVIDERS,
    PRIMENG_PROVIDER,
    ...KEYCLOAK_PROVIDERS,
    DialogService,
    MessageService,
    ConfirmationService,
  ],
};
