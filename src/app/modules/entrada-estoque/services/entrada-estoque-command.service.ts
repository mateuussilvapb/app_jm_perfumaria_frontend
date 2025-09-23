//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Internos
import { MovimentacaoEstoque } from '@shared/interfaces/movimentacao-estoque';
import { AbstractCommandService } from '@shared/services/abstract-command.service';

@Injectable({
  providedIn: 'root',
})
export class EntradaEstoqueCommandService extends AbstractCommandService<MovimentacaoEstoque> {
  protected override path = (): string => 'entradas-estoque';

  constructor(http: HttpClient) {
    super(http);
  }
}
