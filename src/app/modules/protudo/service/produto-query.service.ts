//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Internos
import { AbstractQueryService } from 'app/shared/services/abstract-query.service';
import { Produto } from '../interfaces/produto';

@Injectable({
  providedIn: 'root',
})
export class ProdutoQueryService extends AbstractQueryService<Produto> {
  protected override path = (): string => 'produtos';

  constructor(http: HttpClient) {
    super(http);
  }

  searchByTermAndStatus = (filters?: URLSearchParams) => {
    let params = filters ? `?${filters.toString()}` : '';
    return this.http.get<Produto[]>(`${this.baseURL}/query/searchByFilters${params}`);
  };
}
