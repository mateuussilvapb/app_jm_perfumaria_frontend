//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Externos
import { Observable } from 'rxjs';

//Internos
import { Marca } from '@marca/interfaces/marca';
import { AbstractCommandService } from '@shared/services/abstract-command.service';

@Injectable({
  providedIn: 'root',
})
export class MarcaCommandService extends AbstractCommandService<Marca> {
  protected override path = (): string => 'marcas';

  constructor(http: HttpClient) {
    super(http);
  }

  toggleStatus = (id: string): Observable<Marca> =>
    this.http.patch<Marca>(`${this.baseURL}/command/toogleStatus/${id}`, null);
}
