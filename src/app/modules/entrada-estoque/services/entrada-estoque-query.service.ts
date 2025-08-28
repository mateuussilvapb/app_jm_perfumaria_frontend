//Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//Internos
import { EntradaEstoque } from '@entrada-estoque/interfaces/entrada-estoque';
import { AbstractQueryService } from '@shared/services/abstract-query.service';

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
}
