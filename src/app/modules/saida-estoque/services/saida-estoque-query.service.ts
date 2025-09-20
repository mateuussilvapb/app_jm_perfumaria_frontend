//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Externos
import { map, Observable } from 'rxjs';

//Internos
import { Utils } from '@utils/utils';
import { SaidaEstoque } from '@saida-estoque/interfaces/saida-estoque';
import { AbstractQueryService } from '@shared/services/abstract-query.service';
import { SaidaEstoqueViewUpdateDto } from '@saida-estoque/interfaces/saida-estoque-view-update-dto';

@Injectable({
  providedIn: 'root',
})
export class SaidaEstoqueQueryService extends AbstractQueryService<
  Partial<SaidaEstoque>
> {
  protected override path = (): string => 'saidas-estoque';

  constructor(http: HttpClient) {
    super(http);
  }

  override all = () => {
    return this.http.get<Partial<SaidaEstoque>[]>(`${this.baseURL}/query/list`);
  };

  getAllByFilters = (
    dto: URLSearchParams
  ): Observable<Array<Partial<SaidaEstoque>>> =>
    this.http.get<Array<Partial<SaidaEstoque>>>(
      `${this.baseURL}/query/searchByFilters${Utils.searchParamsToString(dto)}`
    );

  getById = (id: string): Observable<SaidaEstoqueViewUpdateDto> =>
    this.http
      .get<SaidaEstoqueViewUpdateDto>(`${this.baseURL}/query/${id}`)
      .pipe(map((data) => new SaidaEstoqueViewUpdateDto(data)));
}
