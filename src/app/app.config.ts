//Angular
import { provideRouter } from '@angular/router';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

//Externos
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { provideKeycloak } from 'keycloak-angular';

//Internos
import { routes } from './app.routes';
import { environment } from 'environments/environment';
import { Opcoes } from './config/primeNG/traducao.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),

    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.app_jm_perfumaria',
          cssLayer: false,
        },
      },
      ripple: false,
      translation: Opcoes.traducaoPtBr,
    }),

    provideKeycloak({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      initOptions: {
        onLoad: 'login-required',
        redirectUri: window.location.href,
        useNonce: true,
        checkLoginIframe: false,
        scope: 'openid',
      },
    }),
  ],
};
