import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(private router: Router, private readonly keycloak: KeycloakService) {
    // do nothing.
  }

  ngOnInit(): void {
    // do nothing.
  }

  logout() {
    this.keycloak.logout(window.location.origin + '/parking');
  }
}
