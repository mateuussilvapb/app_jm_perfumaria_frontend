import { STATUS } from '@shared/enums/status.enum';

export interface MarcaUpdateDTO {
  id: string;
  nome: string;
  descricao: string;
  status: STATUS;
}
