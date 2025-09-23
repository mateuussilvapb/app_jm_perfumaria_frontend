//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Externos
import { map, Observable } from 'rxjs';

//Internos
import { Utils } from '@utils/utils';
import { MovimentacaoEstoque } from '@shared/interfaces/movimentacao-estoque';
import { AbstractQueryService } from '@shared/services/abstract-query.service';
import { MovimentacaoEstoqueViewUpdateDto } from '@shared/interfaces/movimentacao-estoque-view-update-dto';

@Injectable({
  providedIn: 'root',
})
export class EntradaEstoqueQueryService extends AbstractQueryService<
  Partial<MovimentacaoEstoque>
> {
  protected override path = (): string => 'entradas-estoque';

  constructor(http: HttpClient) {
    super(http);
  }

  override all = () => {
    return this.http.get<Partial<MovimentacaoEstoque>[]>(
      `${this.baseURL}/query/list`
    );
  };

  getAllByFilters = (
    dto: URLSearchParams
  ): Observable<Array<Partial<MovimentacaoEstoque>>> =>
    this.http.get<Array<Partial<MovimentacaoEstoque>>>(
      `${this.baseURL}/query/searchByFilters${Utils.searchParamsToString(dto)}`
    );

  getById = (id: string): Observable<MovimentacaoEstoqueViewUpdateDto> =>
    this.http
      .get<MovimentacaoEstoqueViewUpdateDto>(`${this.baseURL}/query/${id}`)
      .pipe(map((data) => new MovimentacaoEstoqueViewUpdateDto(data)));
}
