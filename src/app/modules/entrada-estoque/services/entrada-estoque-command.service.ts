//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Internos
import { EntradaEstoque } from '@entrada-estoque/interfaces/entrada-estoque';
import { AbstractCommandService } from '@shared/services/abstract-command.service';

@Injectable({
  providedIn: 'root',
})
export class EntradaEstoqueCommandService extends AbstractCommandService<EntradaEstoque> {
  protected override path = (): string => 'entradas-estoque';

  constructor(http: HttpClient) {
    super(http);
  }
}
