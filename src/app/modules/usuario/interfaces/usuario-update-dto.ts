//Interno
import { UsuarioCreateDto } from '@usuario/interfaces/usuario-create-dto';

export interface UsuarioUpdateDto extends UsuarioCreateDto {
  id: string;
}
