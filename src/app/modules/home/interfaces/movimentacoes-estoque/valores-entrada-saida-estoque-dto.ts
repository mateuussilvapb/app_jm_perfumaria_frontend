import { ValoresEstoqueDTO } from "./valores-estoque-dto";

export interface ValoresEntradaSaidaEstoqueDTO {
  entradaEstoqueValores: Array<ValoresEstoqueDTO>;
  saidaEstoqueValores: Array<ValoresEstoqueDTO>;
}