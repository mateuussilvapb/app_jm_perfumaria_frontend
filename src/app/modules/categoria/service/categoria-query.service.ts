//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Internos
import { Categoria } from '@categoria/interfaces/categoria';
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
    let params = filters ? `?${filters.toString()}` : '';
    return this.http.get<Categoria[]>(`${this.baseURL}/query/searchByTermAndStatus${params}`);
  };
}
