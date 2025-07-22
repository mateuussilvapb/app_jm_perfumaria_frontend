import { STATUS } from '@shared/enums/status.enum';

export interface CategoriaUpdateDTO {
  id: string;
  nome: string;
  descricao: string;
  status: STATUS;
}
