import { Categoria } from "@categoria/interfaces/categoria";
import { SITUACAO } from "@shared/enums/situacao.enum";
import { STATUS } from "@shared/enums/status.enum";
import { Marca } from "app/modules/marca/interfaces/marca";

export interface Produto {
  id: string;
  createdAt: string;
  createdBy: string;
  nome: string;
  descricao: string;
  precoCusto: number;
  precoVenda: number;
  status: STATUS;
  situacao: SITUACAO;
  codigo: number;
  quantidadeEmEstoque: number;
  marca: Marca;
  categoria: Categoria;
  identificacao: string;
  idString: string;
}