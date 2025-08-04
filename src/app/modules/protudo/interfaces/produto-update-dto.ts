import { Categoria } from '@categoria/interfaces/categoria';
import { SITUACAO } from '@shared/enums/situacao.enum';
import { STATUS } from '@shared/enums/status.enum';
import { Marca } from 'app/modules/marca/interfaces/marca';

export interface ProdutoUpdateDTO {
  id: string;
  nome: string;
  descricao: string;
  precoCusto: number;
  precoVenda: number;
  status: STATUS;
  situacao: SITUACAO;
  idCategoria: Categoria;
  idMarca: Marca;
}
