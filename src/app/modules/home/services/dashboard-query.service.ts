//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Internos
import { AbstractQueryService } from '@shared/services/abstract-query.service';
import { InformacoesEstoqueDTO } from '@home/interfaces/informacoes-estoque-dto';

@Injectable({
  providedIn: 'root'
})
export class DashboardQueryService extends AbstractQueryService<any> {
  protected override path = (): string => 'dashboard';

  constructor(http: HttpClient) {
    super(http);
  }

  getInformacoesEstoque = () => {
    return this.http.get<InformacoesEstoqueDTO>(
      `${this.baseURL}/query/valor-total-estoque`
    );
  };
}