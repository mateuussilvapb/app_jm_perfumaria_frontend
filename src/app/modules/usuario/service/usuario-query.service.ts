//Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Internos
import { Utils } from '@utils/utils';
import { UsuarioResponseDto } from '@usuario/interfaces/usuario-response-dto';
import { AbstractQueryService } from '@shared/services/abstract-query.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioQueryService extends AbstractQueryService<UsuarioResponseDto> {
  protected override path = (): string => 'api/users';

  constructor(http: HttpClient) {
    super(http);
  }

  searchByTerm = (filters?: URLSearchParams) => {
    return this.http.get<UsuarioResponseDto[]>(
      `${this.baseURL}/searchByParam${Utils.searchParamsToString(filters)}`
    );
  };
}
