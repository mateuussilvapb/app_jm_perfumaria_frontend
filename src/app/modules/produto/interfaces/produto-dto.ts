//Internos
import { STATUS } from '@shared/enums/status.enum';

export interface ProdutoDto {
  nome: string;
  descricao: string;
  precoCusto: number;
  precoVenda: number;
  idCategoria: string;
  idMarca: string;
  status: STATUS;
}
