//Interno
import { Usuario } from '@usuario/interfaces/usuario';

export interface UsuarioResponseDto extends Usuario {
  id: string;
  enabled: boolean;
}
