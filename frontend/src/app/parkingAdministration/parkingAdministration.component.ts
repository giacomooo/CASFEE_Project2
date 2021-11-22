import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KeycloakService } from 'keycloak-angular';
import { Globals } from '../globals';
import { Parking } from '../models/Parking';
import { ParkingService } from '../services/parking.service';

@Component({
  selector: 'app-parking-administration',
  templateUrl: './parkingAdministration.component.html',
  styleUrls: ['./parkingAdministration.component.scss']
})
export class ParkingAdministrationComponent implements OnInit {
  public parkings?: Parking[];

  constructor(private _parkingService: ParkingService, protected _keycloakAngular: KeycloakService, private _snackBar: MatSnackBar, private globals: Globals) { }

  async ngOnInit() {
    this.globals.isLoading = true;
    const id_landlord = await this._keycloakAngular.getKeycloakInstance().subject;
    if (id_landlord && id_landlord?.length > 0) {
      const httpParams = new HttpParams().set('ID_Landlord', id_landlord);

      this._parkingService.readParkings(httpParams).subscribe(result => {
        this.parkings = result;
        this.globals.isLoading = false;
      });
    }
    else {
      this.globals.isLoading = false;
      this._snackBar.open('Die Parkplätze konnten nicht geladen werden.', 'Schliessen');
    }
  }

}
