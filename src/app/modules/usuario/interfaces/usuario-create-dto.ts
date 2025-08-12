//Internos
import { ROLES } from '@shared/models/roles';
import { Usuario } from '@usuario/interfaces/usuario';

export interface UsuarioCreateDto extends Usuario {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roles: Array<ROLES>;
}
