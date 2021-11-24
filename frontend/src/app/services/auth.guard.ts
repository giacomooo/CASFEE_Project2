import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable()
export class AppAuthGuard extends KeycloakAuthGuard {
  constructor(protected router: Router, protected keycloakAngular: KeycloakService) {
    super(router, keycloakAngular);
  }

  isAccessAllowed(route: ActivatedRouteSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let permission;
      if (!this.authenticated) {
        // eslint-disable-next-line no-console
        this.keycloakAngular.login().catch((e) => console.error(e));
        reject();
      }

      const requiredRoles: string[] = route.data.roles;
      if (!requiredRoles || requiredRoles.length === 0) {
        permission = true;
      } else {
        if (!this.roles || this.roles.length === 0) {
          permission = false;
        }
        if (requiredRoles.every((role) => this.roles.indexOf(role) > -1)) {
          permission = true;
        } else {
          permission = false;
        }
      }
      if (!permission) {
        this.router.navigate(['/']);
      }
      resolve(permission);
    });
  }
}
