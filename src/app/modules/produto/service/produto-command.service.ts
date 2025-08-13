//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Externos
import { Observable } from 'rxjs';

//Internos
import { Produto } from '@produto/interfaces/produto';
import { AbstractCommandService } from '@shared/services/abstract-command.service';

@Injectable({
  providedIn: 'root',
})
export class ProdutoCommandService extends AbstractCommandService<Produto> {
  protected override path = (): string => 'produtos';

  constructor(http: HttpClient) {
    super(http);
  }

  toogleStatus = (id: string): Observable<Produto> =>
    this.http.patch<Produto>(`${this.baseURL}/command/toogleStatus/${id}`, null);
}
