import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-nav-bottom',
  templateUrl: './nav-bottom.component.html',
  styleUrls: ['./nav-bottom.component.scss'],
})
export class NavBottomComponent implements OnInit {
  public userProfile?: KeycloakProfile;
  public isLoggedIn = false;
  public appTitle = 'Parkplatzverwaltung';

  constructor(private readonly keycloak: KeycloakService) {

  }

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
    }
  }
}
