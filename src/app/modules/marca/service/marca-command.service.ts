//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Internos
import { Marca } from 'app/modules/marca/interfaces/marca';
import { AbstractCommandService } from 'app/shared/services/abstract-command.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarcaCommandService extends AbstractCommandService<Marca> {
  protected override path = (): string => 'marcas';

  constructor(http: HttpClient) {
    super(http);
  }

  toogleStatus = (id: string): Observable<Marca> =>
    this.http.patch<Marca>(`${this.baseURL}/command/toogleStatus/${id}`, null);
}
