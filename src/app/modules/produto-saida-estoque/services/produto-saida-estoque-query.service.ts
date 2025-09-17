//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Internos
import { Utils } from '@utils/utils';
import { AbstractQueryService } from '@shared/services/abstract-query.service';
import { ProdutoSaidaEstoque } from '../interfaces/produto-saida-estoque';

@Injectable({
  providedIn: 'root',
})
export class ProdutoSaidaEstoqueQueryService extends AbstractQueryService<
  Partial<ProdutoSaidaEstoque>
> {
  protected override path = (): string => 'produtos-saidas-estoque';

  constructor(http: HttpClient) {
    super(http);
  }

  findAllBySaidaEstoqueId = (filters?: URLSearchParams) => {
    return this.http.get<Partial<ProdutoSaidaEstoque>[]>(
      `${this.baseURL}/query/findBySaidaEstoqueId${Utils.searchParamsToString(
        filters
      )}`
    );
  };
}
