import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { IParking, ParkingService } from '../services/parking.service';

@Component({
  selector: 'app-parking',
  templateUrl: './parking.component.html',
  styleUrls: ['./parking.component.scss']
})
export class ParkingComponent implements OnInit {

  public isLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;
  parkings: any;

  constructor(private readonly keycloak: KeycloakService, private parkingService: ParkingService) { }

  public async ngOnInit() {
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      this.userProfile = await this.keycloak.loadUserProfile();
      console.warn(this.userProfile);
    }

    this.parkings = await this.parkingService.readParkings();
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout();
  }

}
