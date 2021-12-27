import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KeycloakService } from 'keycloak-angular';
import { Globals } from '../globals';
import { Parking } from '../models/Parking';
import { Reservation } from '../models/Reservation';
import { ParkingService } from '../services/parking.service';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})

export class ReservationComponent implements OnInit {
  public reservations?: Reservation[];
  public withHistory: boolean = false;

  constructor(private readonly _reservationService: ReservationService,
    private readonly _parkingService: ParkingService,
    protected _keycloakAngular: KeycloakService,
    private _snackBar: MatSnackBar,
    public globals: Globals) {
    // do nothing
  }

  async ngOnInit(): Promise<void> {
    this.backendCall();
  }

  public refresh(event: Boolean): void {
    this.withHistory = !this.withHistory;
    this.backendCall();
  }

  public async backendCall(): Promise<void> {
    // this.globals.isLoading = true;
    const idLandlord = await this._keycloakAngular.getKeycloakInstance().subject;
    if (idLandlord && idLandlord?.length > 0) {
      const httpParams = new HttpParams().set('ID_Landlord', idLandlord).set('withHistory', this.withHistory);

      this._reservationService.readReservations(httpParams).subscribe((reservations) => {
        // this.globals.isLoading = false;
        reservations.map((reservation) => this._parkingService.readParking(reservation.ID_Parking).subscribe((parking) => {
          reservation.Parking = parking;
        }));
        this.reservations = reservations;
      });
    } else {
      // this.globals.isLoading = false;
      this._snackBar.open('Die Reservationen konnten nicht geladen werden.', 'Schliessen');
    }
  }
}
