import * as packageJson from '../../package.json';

export const environment = {
  apiUrl: '',
  postLogoutUrl: '',
  keycloak: {
    url: '',
    realm: 'JMPERFUMARIA',
    clientId: '',
    acceptablePaths: [],
  },
  packageInfo: packageJson,
};
