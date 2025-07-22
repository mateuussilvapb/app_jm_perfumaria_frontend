//Angular
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

//Externos
import Keycloak from 'keycloak-js';
import { MessageService } from 'primeng/api';

//Internos
import { ROLES } from '@shared/models/roles';
import { UtilsService } from '@utils/utils.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private readonly messageService = inject(MessageService);
  private readonly keycloak = inject(Keycloak);

  constructor(private readonly utilsService: UtilsService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    try {
      //Verifica se o usuário está autenticado
      const isLoggedIn = this.keycloak.authenticated;

      //Se o usuário não estiver autenticado, redireciona para login.
      if (!isLoggedIn) {
        await this.keycloak.login({
          redirectUri: window.location.origin + state.url,
        });
        return false;
      }

      //Recupera as roles do usuário autenticado
      const userRoles = this.utilsService.getUserRoles();

      //Recupera as roles da rota
      const allowedRoles: string[] = route.data['roles'];

      //Se não houver configurações de permissionamento para a rota, permiti-se o acesso
      if (!allowedRoles || allowedRoles.length === 0) {
        return true;
      }

      //Verifica se o usuário autenticado possui as roles permitidas para acessar a rota.
      const hasRole = [...allowedRoles, ROLES.ADMIN].some((role) =>
        userRoles.includes(role)
      );

      //Se não possuir, o acesso é negado
      if (!hasRole) {
        this.messageService.add({
          severity: 'error',
          summary: 'Acesso negado',
          detail: 'Você não tem permissão para acessar essa página',
          life: 5000,
        });
        return false;
      }

      return true;
    } catch (error: any) {
      throw new Error(
        'Ocorreu um erro na validação de acesso. Detalhes: ' +
          (error?.message ?? error)
      );
    }
  }
}
