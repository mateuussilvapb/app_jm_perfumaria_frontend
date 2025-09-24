//Internos
import { STATUS } from '@shared/enums/status.enum';
import { SITUACAO } from '@shared/enums/situacao.enum';
import { ProdutoMovimentacaoEstoque } from '@shared/interfaces/produto-movimentacao-estoque';

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
  movimentacaoProdutos: Array<Partial<ProdutoMovimentacaoEstoque>>;
}
