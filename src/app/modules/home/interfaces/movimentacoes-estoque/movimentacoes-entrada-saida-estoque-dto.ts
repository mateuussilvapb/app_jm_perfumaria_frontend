import { MovimentacoesEstoqueDTO } from "./movimentacoes-estoque-dto";

export interface MovimentacoesEntradaSaidaEstoqueDTO {
  entradaEstoqueItens: Array<MovimentacoesEstoqueDTO>;
  saidaEstoqueItens: Array<MovimentacoesEstoqueDTO>;
}