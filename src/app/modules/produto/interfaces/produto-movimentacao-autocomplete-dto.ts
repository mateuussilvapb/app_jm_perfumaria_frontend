export class ProdutoMovimentacaoAutocompleteDto {
  id: string;
  nome: string;
  quantidadeEmEstoque: number;
  precoCusto: number;
  precoVenda: number;

  constructor(data: Partial<ProdutoMovimentacaoAutocompleteDto>) {
    if (data) {
      this.id = data.id!;
      this.nome = data.nome!;
      this.quantidadeEmEstoque = data.quantidadeEmEstoque!;
      this.precoCusto = data.precoCusto!;
      this.precoVenda = data.precoVenda!;
    }
  }
}
