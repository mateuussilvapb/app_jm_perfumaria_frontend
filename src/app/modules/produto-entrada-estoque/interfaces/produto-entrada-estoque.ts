//Internos
import { STATUS } from '@shared/enums/status.enum';
import { Produto } from '@produto/interfaces/produto';

export interface ProdutoEntradaEstoque {
  id: number;
  precoUnitario: number;
  quantidade: number;
  status: STATUS;
  desconto: number;
  idString: string;
  createdAt: string;
  createdBy: string;
  produto: Partial<Produto>;
}
