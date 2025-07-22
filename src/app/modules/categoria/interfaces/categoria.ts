import { STATUS } from "@shared/enums/status.enum";

export interface Categoria {
  id: number;
  createdAt: string;
  createdBy: string;
  nome: string;
  descricao: string;
  status: STATUS;
  idString: string;
}
