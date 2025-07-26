import { STATUS } from '@shared/enums/status.enum';

export interface ProdutoUpdateDTO {
  id: string;
  nome: string;
  descricao: string;
  status: STATUS;
}
