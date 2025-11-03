import * as packageJson from '../../package.json';

export const environment = {
  production: true,
  apiUrl: '',
  postLogoutUrl: '',
  baseHref: '',
  keycloak: {
    url: '',
    realm: 'JMPERFUMARIA',
    clientId: '',
    acceptablePaths: [],
  },
  packageInfo: packageJson,
};
