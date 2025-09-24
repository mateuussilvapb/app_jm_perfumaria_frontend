//Internos
import { STATUS } from '@shared/enums/status.enum';
import { SITUACAO } from '@shared/enums/situacao.enum';
import { ProdutoMovimentacaoEstoqueCreateDto } from '@shared/interfaces/produto-movimentacao-estoque-create-dto';

export class MovimentacaoEstoqueCreateDto {
  status: STATUS;
  situacao: SITUACAO;
  descricao: string;
  dataMovimentacaoEstoque: Date;
  produtos: Array<ProdutoMovimentacaoEstoqueCreateDto>;

  constructor(data: any) {
    if (data) {
      this.status = data.status ?? STATUS.INATIVO;
      this.situacao = data.situacao ?? SITUACAO.EM_CADASTRAMENTO;
      this.descricao = data.descricao ?? '';
      this.dataMovimentacaoEstoque = data.dataMovimentacaoEstoque ?? new Date();
      this.produtos =
        data.produtos?.map(
          (produto) => new ProdutoMovimentacaoEstoqueCreateDto(produto)
        ) ?? [];
    }
  }
}
