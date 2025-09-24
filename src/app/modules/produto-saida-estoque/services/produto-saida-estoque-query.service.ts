//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Internos
import { Utils } from '@utils/utils';
import { AbstractQueryService } from '@shared/services/abstract-query.service';
import { ProdutoMovimentacaoEstoque } from '@shared/interfaces/produto-movimentacao-estoque';

@Injectable({
  providedIn: 'root',
})
export class ProdutoSaidaEstoqueQueryService extends AbstractQueryService<
  Partial<ProdutoMovimentacaoEstoque>
> {
  protected override path = (): string => 'produtos-saidas-estoque';

  constructor(http: HttpClient) {
    super(http);
  }

  findAllBySaidaEstoqueId = (filters?: URLSearchParams) => {
    return this.http.get<Partial<ProdutoMovimentacaoEstoque>[]>(
      `${this.baseURL}/query/findBySaidaEstoqueId${Utils.searchParamsToString(
        filters
      )}`
    );
  };
}
