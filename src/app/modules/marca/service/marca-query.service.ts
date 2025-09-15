//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Externos
import { map } from 'rxjs';

//Internos
import { Utils } from '@utils/utils';
import { Marca } from '@marca/interfaces/marca';
import { AutocompleteDto } from '@shared/interfaces/autocomplete-dto';
import { AbstractQueryService } from '@shared/services/abstract-query.service';

@Injectable({
  providedIn: 'root',
})
export class MarcaQueryService extends AbstractQueryService<Marca> {
  protected override path = (): string => 'marcas';

  constructor(http: HttpClient) {
    super(http);
  }

  searchByTermAndStatus = (filters?: URLSearchParams) => {
    return this.http.get<Marca[]>(
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
