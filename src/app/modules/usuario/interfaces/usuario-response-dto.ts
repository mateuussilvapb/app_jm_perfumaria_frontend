import { Usuario } from './usuario';

export interface UsuarioResponseDto extends Usuario {
  id: string;
}
