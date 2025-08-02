import { ROLES } from '@shared/models/roles';

export interface Usuario {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roles: Array<ROLES>;
}
