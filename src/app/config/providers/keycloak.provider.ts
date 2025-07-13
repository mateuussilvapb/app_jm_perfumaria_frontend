//Externos
import {
  provideKeycloak,
  createInterceptorCondition,
  IncludeBearerTokenCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
} from 'keycloak-angular';

//Internos
import { environment } from 'environments/environment';

const apiCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: new RegExp(`^${environment.apiUrl}(\\/.*)?$`, 'i'),
  bearerPrefix: 'Bearer',
});

export const KEYCLOAK_PROVIDERS = [
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
  {
    provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
    useValue: [apiCondition],
  },
];
