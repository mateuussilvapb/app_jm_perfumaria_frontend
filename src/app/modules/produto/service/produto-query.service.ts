//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Externos
import { map } from 'rxjs';

//Internos
import { Produto } from '@produto/interfaces/produto';
import { AutocompleteDto } from '@shared/interfaces/autocomplete-dto';
import { AbstractQueryService } from '@shared/services/abstract-query.service';
import { ProdutoMovimentacaoAutocompleteDto } from '@produto/interfaces/produto-movimentacao-autocomplete-dto';

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

  getAllAutocomplete = () => {
    return this.http
      .get<AutocompleteDto[]>(`${this.baseURL}/query/ativos/autocomplete`)
      .pipe(map((items) => items.map((item) => new AutocompleteDto(item))));
  };

  getAllAutocompletMovimentacao = () => {
    return this.http
      .get<Partial<Produto>[]>(`${this.baseURL}/query/ativos/autocomplete/movimentacaoEstoque`)
      .pipe(map((items) => items.map((item) => new ProdutoMovimentacaoAutocompleteDto(item))));
  };
}
