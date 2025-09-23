//Internos
import { STATUS } from "@shared/enums/status.enum";
import { SITUACAO } from "@shared/enums/situacao.enum";
import { ProdutoEntradaEstoqueCreateDto } from "@produto-entrada-estoque/interfaces/produto-entrada-estoque-create-dto";

export class MovimentacaoEstoqueCreateDto {
  status: STATUS;
  situacao: SITUACAO;
  descricao: string;
  dataEntradaEstoque: Date;
  produtos: Array<ProdutoEntradaEstoqueCreateDto>;

  constructor(data: any) {
    if (data) {
      this.status = data.status ?? STATUS.INATIVO;
      this.situacao = data.situacao ?? SITUACAO.EM_CADASTRAMENTO;
      this.descricao = data.descricao ?? '';
      this.dataEntradaEstoque = data.dataEntradaEstoque ?? new Date;
      this.produtos = data.produtos?.map((produto) => new ProdutoEntradaEstoqueCreateDto(produto)) ?? [];
    }
  }
}
