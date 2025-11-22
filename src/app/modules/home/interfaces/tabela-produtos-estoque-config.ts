import { Observable } from "rxjs";

// Interface para configurar a tabela
export interface TabelaProdutosEstoqueConfig {
    titulo: string;
    icone: string;
    iconColor: string;
    borderColor: string;
    tooltipMessage: string;
    colunas: TabelaColuna[];
    getMethod: () => Observable<any[]>;
}

export interface TabelaColuna {
    header: string;
    field: string;
    width: string;
    minWidth?: string;
    formatter?: (value: any) => string;
}