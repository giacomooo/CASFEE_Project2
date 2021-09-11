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

  public location: string = '';
  public alternativeDateTime = false;
  public dateTimeFrom: string = '';
  public duration: number = 1;

  constructor(private readonly keycloak: KeycloakService, private parkingService: ParkingService) {
    this.dateTimeFrom = new Date().toISOString().slice(0,16);
  }

  public async ngOnInit() {

  }
}
