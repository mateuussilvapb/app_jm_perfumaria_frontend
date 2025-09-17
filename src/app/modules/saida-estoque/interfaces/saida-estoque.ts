//Internos
import { STATUS } from '@shared/enums/status.enum';
import { SITUACAO } from '@shared/enums/situacao.enum';
import { ProdutoSaidaEstoque } from 'app/modules/produto-saida-estoque/interfaces/produto-saida-estoque';

export interface SaidaEstoque {
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
  dataSaidaEstoque: Date;
  saidasProdutos: Array<Partial<ProdutoSaidaEstoque>>;
}
