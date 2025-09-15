//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Externos
import { map } from 'rxjs';

//Internos
import { Utils } from '@utils/utils';
import { Categoria } from '@categoria/interfaces/categoria';
import { AutocompleteDto } from '@shared/interfaces/autocomplete-dto';
import { AbstractQueryService } from '@shared/services/abstract-query.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriaQueryService extends AbstractQueryService<Categoria> {
  protected override path = (): string => 'categorias';

  constructor(http: HttpClient) {
    super(http);
  }

  searchByTermAndStatus = (filters?: URLSearchParams) => {
    return this.http.get<Categoria[]>(
      `${this.baseURL}/query/searchByTermAndStatus${Utils.searchParamsToString(
        filters
      )}`
    );
  };

  getAllAutocomplete = () => {
    return this.http
      .get<AutocompleteDto[]>(`${this.baseURL}/query/ativos/autocomplete`)
      .pipe(map((items) => items.map((item) => new AutocompleteDto(item))));
  };
}
