//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Externos
import { Observable } from 'rxjs';

//Internos
import { Usuario } from '@usuario/interfaces/usuario';
import { AlterarSenhaDto } from '@usuario/interfaces/alterar-senha';
import { UsuarioCreateDto } from '@usuario/interfaces/usuario-create-dto';
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

  override delete = (id: string): Observable<any> =>
    this.http.delete(`${this.baseURL}/${id}`);

  override create = (body: any): Observable<UsuarioCreateDto> =>
    this.http.post<UsuarioCreateDto>(`${this.baseURL}`, body);

  override update = (id: string, body: any): Observable<any> =>
    this.http.put<any>(`${this.baseURL}/${id}`, body);
}
