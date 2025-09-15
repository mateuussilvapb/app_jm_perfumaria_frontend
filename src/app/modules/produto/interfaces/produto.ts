//Internos
import { Marca } from "@marca/interfaces/marca";
import { STATUS } from "@shared/enums/status.enum";
import { Categoria } from "@categoria/interfaces/categoria";

export interface Produto {
  id: string;
  createdAt: string;
  createdBy: string;
  nome: string;
  descricao: string;
  precoCusto: number;
  precoVenda: number;
  status: STATUS;
  codigo: number;
  quantidadeEmEstoque: number;
  marca: Partial<Marca>;
  categoria: Partial<Categoria>;
  identificacao: string;
  idString: string;
}
