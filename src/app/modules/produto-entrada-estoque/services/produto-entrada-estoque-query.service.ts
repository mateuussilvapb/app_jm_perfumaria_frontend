//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Internos
import { Utils } from '@utils/utils';
import { AbstractQueryService } from '@shared/services/abstract-query.service';
import { ProdutoEntradaEstoque } from '@produto-entrada-estoque/interfaces/produto-entrada-estoque';

@Injectable({
  providedIn: 'root',
})
export class ProdutoEntradaEstoqueQueryService extends AbstractQueryService<Partial<ProdutoEntradaEstoque>> {
  protected override path = (): string => 'produtos-entradas-estoque';

  constructor(http: HttpClient) {
    super(http);
  }

  findAllByEntradaEstoqueId = (filters?: URLSearchParams) => {
    return this.http.get<Partial<ProdutoEntradaEstoque>[]>(
      `${this.baseURL}/query/findByEntradaEstoqueId${Utils.searchParamsToString(
        filters
      )}`
    );
  };

}
