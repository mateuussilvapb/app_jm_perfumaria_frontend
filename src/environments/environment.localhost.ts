import * as packageJson from '../../package.json';

export const environment = {
  apiUrl: 'https://api.18-229-37-145.sslip.io',
  postLogoutUrl: '',
  baseHref: '',
  keycloak: {
    url: 'https://auth.18-229-37-145.sslip.io',
    realm: 'JMPERFUMARIA',
    clientId: 'app_jm_perfumaria',
    acceptablePaths: [],
  },
  packageInfo: packageJson,
};
