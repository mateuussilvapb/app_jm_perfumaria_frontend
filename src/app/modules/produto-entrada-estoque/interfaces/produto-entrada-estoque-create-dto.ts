//Internos
import { STATUS } from '@shared/enums/status.enum';

export class ProdutoEntradaEstoqueCreateDto {
  idProduto: string;
  precoUnitario: number;
  quantidade: number;
  status: STATUS;
  desconto: number;

  constructor(data: any) {
    if (data) {
      this.idProduto = data.idProduto ?? '';
      this.precoUnitario = data.precoUnitario ?? 0;
      this.quantidade = data.quantidade ?? 0;
      this.status = data.status ?? STATUS.INATIVO;
      if (typeof data.desconto === 'string') {
        const parsed = parseFloat(data.desconto);
        this.desconto = isNaN(parsed) ? 0 : parsed / 100;
      } else {
        this.desconto = data.desconto ?? 0;
      }
    }
  }
}
