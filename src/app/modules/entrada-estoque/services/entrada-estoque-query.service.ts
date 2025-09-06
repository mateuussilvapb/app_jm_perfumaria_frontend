//Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//Externos
import { map, Observable } from 'rxjs';

//Internos
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

  getById = (id: string): Observable<EntradaEstoqueViewUpdateDto> =>
    this.http
      .get<EntradaEstoqueViewUpdateDto>(`${this.baseURL}/query/${id}`)
      .pipe(map((data) => new EntradaEstoqueViewUpdateDto(data)));
}
