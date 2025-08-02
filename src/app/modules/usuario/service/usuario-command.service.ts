import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractCommandService } from '@shared/services/abstract-command.service';
import { AlterarSenhaDto } from '@usuario/interfaces/alterar-senha';
import { Usuario } from '@usuario/interfaces/usuario';
import { Observable } from 'rxjs';

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
}
