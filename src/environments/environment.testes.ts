import * as packageJson from '../../package.json';

export const environment = {
  apiUrl: '',
  postLogoutUrl: '',
  keycloak: {
    url: '',
    realm: '',
    clientId: '',
    acceptablePaths: [],
  },
  packageInfo: packageJson,
};
