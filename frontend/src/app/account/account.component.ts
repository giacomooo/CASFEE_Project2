import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  constructor(private readonly keycloak: KeycloakService) {
    // do nothing.
  }

  logout() {
    this.keycloak.logout(`${window.location.origin}/parking`);
  }
}
