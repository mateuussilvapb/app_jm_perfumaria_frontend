//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Externos
import { Observable } from 'rxjs';

//Internos
import { Usuario } from '@usuario/interfaces/usuario';
import { AlterarSenhaDto } from '@usuario/interfaces/alterar-senha';
import { AbstractCommandService } from '@shared/services/abstract-command.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioCommandService extends AbstractCommandService<Usuario> {
  protected override path = (): string => 'api/users';

  constructor(http: HttpClient) {
    super(http);
  }

  alterarSenha = (dto: AlterarSenhaDto): Observable<any> =>
    this.http.put(`${this.baseURL}/senha`, dto);

  toggleStatus = (id: string): Observable<any> =>
    this.http.put(`${this.baseURL}/${id}/toggleStatus`, null);
}
