//Internos
import { STATUS } from '@shared/enums/status.enum';
import { SITUACAO } from '@shared/enums/situacao.enum';
import { ProdutoEntradaEstoque } from '@produto-entrada-estoque/interfaces/produto-entrada-estoque';

export interface MovimentacaoEstoque {
  id: number;
  status: STATUS;
  situacao: SITUACAO;
  descricao: string;
  codigo: string;
  idString: string;
  createdAt: string;
  createdBy: string;
  qtdItens: number;
  qtdItensUnicos: number;
  dataMovimentacaoEstoque: Date;
  movimentacaoProdutos: Array<Partial<ProdutoEntradaEstoque>>;
}
