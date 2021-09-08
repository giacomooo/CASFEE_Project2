import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';

declare var Keycloak: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private keycloakAuth: any;

  // init(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     //  this.keycloakAuth = new KeycloakService();
  //     this.keycloakAuth = Keycloak;
  //     KeycloakService.init(environment.keycloakOptions)
  //       .success(() => {
  //         resolve('success');
  //       })
  //       .error(() => {
  //         reject();
  //       });
  //   });
  // }
}
