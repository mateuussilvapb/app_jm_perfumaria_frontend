//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Externos
import { map, Observable } from 'rxjs';

//Internos
import { Utils } from '@utils/utils';
import { EntradaEstoque } from '@entrada-estoque/interfaces/entrada-estoque';
import { AbstractQueryService } from '@shared/services/abstract-query.service';
import { EntradaEstoqueViewUpdateDto } from '@entrada-estoque/interfaces/entrada-estoque-view-update-dto';

@Injectable({
  providedIn: 'root',
})
export class EntradaEstoqueQueryService extends AbstractQueryService<Partial<EntradaEstoque>> {
  protected override path = (): string => 'entradas-estoque';

  constructor(http: HttpClient) {
    super(http);
  }

  override all = () => {
    return this.http.get<Partial<EntradaEstoque>[]>(
      `${this.baseURL}/query/list`
    );
  };

  getAllByFilters = (dto: URLSearchParams): Observable<Array<Partial<EntradaEstoque>>> =>
    this.http
      .get<Array<Partial<EntradaEstoque>>>(`${this.baseURL}/query/searchByFilters${Utils.searchParamsToString(dto)}`);

  getById = (id: string): Observable<EntradaEstoqueViewUpdateDto> =>
    this.http
      .get<EntradaEstoqueViewUpdateDto>(`${this.baseURL}/query/${id}`)
      .pipe(map((data) => new EntradaEstoqueViewUpdateDto(data)));
}
