//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Internos
import { Marca } from 'app/modules/marca/interfaces/marca';
import { AbstractQueryService } from 'app/shared/services/abstract-query.service';

@Injectable({
  providedIn: 'root',
})
export class MarcaQueryService extends AbstractQueryService<Marca> {
  protected override path = (): string => 'marcas';

  constructor(http: HttpClient) {
    super(http);
  }

  searchByTermAndStatus = (filters?: URLSearchParams) => {
    let params = filters ? `?${filters.toString()}` : '';
    return this.http.get<Marca[]>(`${this.baseURL}/query/searchByTermAndStatus${params}`);
  };
}
