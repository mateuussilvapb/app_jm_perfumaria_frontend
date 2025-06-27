//Angular
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { inject, Injectable } from '@angular/core';

//Externos
import Keycloak from 'keycloak-js';
import { MessageService } from 'primeng/api';
import { ROLES } from 'app/shared/models/roles';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly keycloak = inject(Keycloak);

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
      const userRoles = this.getUserRoles();

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

  private getUserRoles(realmRoles = true): string[] {
    if (!this.keycloak?.authenticated) {
      return [];
    }

    let roles: string[] = [];

    if (this.keycloak.resourceAccess) {
      Object.keys(this.keycloak.resourceAccess).forEach((key) => {
        if (key !== this.keycloak.clientId) {
          return;
        }

        if (!this.keycloak.resourceAccess) {
          return;
        }

        const resourceAccess = this.keycloak.resourceAccess[key];
        const clientRoles = resourceAccess['roles'] || [];
        roles = roles.concat(clientRoles);
      });
    }

    if (realmRoles && this.keycloak.realmAccess) {
      const realmRoles = this.keycloak.realmAccess['roles'] || [];
      roles.push(...realmRoles);
    }

    return roles;
  }
}
