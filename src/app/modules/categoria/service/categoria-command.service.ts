//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Externos
import { Observable } from 'rxjs';

//Internos
import { Categoria } from '@categoria/interfaces/categoria';
import { AbstractCommandService } from '@shared/services/abstract-command.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriaCommandService extends AbstractCommandService<Categoria> {
  protected override path = (): string => 'categorias';

  constructor(http: HttpClient) {
    super(http);
  }

  toogleStatus = (id: string): Observable<Categoria> =>
    this.http.patch<Categoria>(`${this.baseURL}/command/toogleStatus/${id}`, null);
}
