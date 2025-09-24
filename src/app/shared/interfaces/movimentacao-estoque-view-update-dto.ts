//Internos
import { STATUS } from '@shared/enums/status.enum';
import { SITUACAO } from '@shared/enums/situacao.enum';
import { ProdutoMovimentacaoEstoque } from '@shared/interfaces/produto-movimentacao-estoque';

export class MovimentacaoEstoqueViewUpdateDto {
  public id: string;
  public idString: string;
  public createdAt: string;
  public createdBy: string;
  public status: STATUS;
  public situacao: SITUACAO;
  public descricao: string;
  public codigo: number;
  public dataMovimentacaoEstoque: Date;
  public movimentacaoProdutos: Array<Partial<ProdutoMovimentacaoEstoque>>;

  constructor(data: any) {
    if (data) {
      this.id = data.id;
      this.idString = data.idString;
      this.createdAt = data.createdAt;
      this.createdBy = data.createdBy;
      this.status = data.status;
      this.situacao = data.situacao;
      this.descricao = data.descricao;
      this.codigo = data.codigo;
      this.dataMovimentacaoEstoque = data.dataMovimentacaoEstoque
        ? new Date(data.dataMovimentacaoEstoque)
        : new Date();
      this.movimentacaoProdutos = data.movimentacaoProdutos
        ? data.movimentacaoProdutos.map(
            (p: any) => new ProdutoMovimentacaoEstoque(p)
          )
        : [];
    }
  }
}
