//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Internos
import { SaidaEstoque } from '@saida-estoque/interfaces/saida-estoque';
import { AbstractCommandService } from '@shared/services/abstract-command.service';

@Injectable({
  providedIn: 'root',
})
export class SaidaEstoqueCommandService extends AbstractCommandService<SaidaEstoque> {
  protected override path = (): string => 'saidas-estoque';

  constructor(http: HttpClient) {
    super(http);
  }
}
