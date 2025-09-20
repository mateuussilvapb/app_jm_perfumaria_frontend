//Internos
import { STATUS } from '@shared/enums/status.enum';
import { SITUACAO } from '@shared/enums/situacao.enum';
import { ProdutoSaidaEstoque } from '@produto-saida-estoque/interfaces/produto-saida-estoque';

export class SaidaEstoqueViewUpdateDto {
  public id: string;
  public idString: string;
  public createdAt: string;
  public createdBy: string;
  public status: STATUS;
  public situacao: SITUACAO;
  public descricao: string;
  public codigo: number;
  public dataSaidaEstoque: Date;
  public saidasProdutos: Array<Partial<ProdutoSaidaEstoque>>;

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
      this.dataSaidaEstoque = data.dataSaidaEstoque
        ? new Date(data.dataSaidaEstoque)
        : new Date();
      this.saidasProdutos = data.saidasProdutos
        ? data.saidasProdutos.map((p: any) => new ProdutoSaidaEstoque(p))
        : [];
    }
  }
}
