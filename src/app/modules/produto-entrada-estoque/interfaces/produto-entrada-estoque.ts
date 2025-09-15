//Internos
import { STATUS } from '@shared/enums/status.enum';
import { Produto } from '@produto/interfaces/produto';

export class ProdutoEntradaEstoque {
  id: number;
  precoUnitario: number;
  quantidade: number;
  status: STATUS;
  desconto: number;
  idString: string;
  createdAt: string;
  createdBy: string;
  produto: Partial<Produto>;

  constructor(data: any) {
    if (data) {
      this.id = data.id;
      this.precoUnitario = data.precoUnitario;
      this.quantidade = data.quantidade;
      this.status = data.status;
      this.desconto = data.desconto;
      this.idString = data.idString;
      this.createdAt = data.createdAt;
      this.createdBy = data.createdBy;
      this.produto = data.produto;
    }
  }
}
