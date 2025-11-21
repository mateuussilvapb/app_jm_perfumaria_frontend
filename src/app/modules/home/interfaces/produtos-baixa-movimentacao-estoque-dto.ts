export interface ProdutosBaixaMovimentacaoEstoqueDTO {
    id: string;
    nome: string;
    categoria: string;
    marca: string;
    quantidadeEmEstoque: number;
    dataUltimaSaida: Date;
    diasSemMovimentacao: number;
}