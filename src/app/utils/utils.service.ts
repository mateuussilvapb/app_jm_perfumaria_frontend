//Angular
import { Injectable } from '@angular/core';

//Externos
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private keycloak: Keycloak) {}

  getUserRoles(realmRoles = true): string[] {
    if (!this.keycloak?.authenticated) {
      return [];
    }

    let roles: string[] = [];

    if (this.keycloak.resourceAccess) {
      Object.keys(this.keycloak.resourceAccess).forEach((key) => {
        if (key !== this.keycloak.clientId) return;

        const resourceAccess = this.keycloak.resourceAccess[key];
        const clientRoles = resourceAccess?.roles || [];
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
