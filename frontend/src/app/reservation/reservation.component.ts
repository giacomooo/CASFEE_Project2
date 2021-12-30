import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Globals } from '../globals';
import { Reservation } from '../models/Reservation';
import { ParkingService } from '../services/parking.service';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})

export class ReservationComponent implements OnInit {
  public reservations?: Reservation[];
  public withHistory = false;

  constructor(
    private readonly _reservationService: ReservationService,
    private readonly _parkingService: ParkingService,
    protected _keycloakAngular: KeycloakService,
    private _snackBar: MatSnackBar,
    public globals: Globals,
    private _activatedRoute: ActivatedRoute,
  ) {
    // do nothing
  }

  async ngOnInit(): Promise<void> {
    this.backendCall();
  }

  public refresh(): void {
    this.withHistory = !this.withHistory;
    this.backendCall();
  }

  public async backendCall(): Promise<void> {
    this.globals.isLoading = true;
    let httpParams = new HttpParams().set('withHistory', this.withHistory);
    const idRenter = await this._keycloakAngular.getKeycloakInstance().subject;

    if (idRenter && idRenter?.length > 0) {
      httpParams = httpParams.append('ID_Renter', idRenter);

      this._reservationService.readReservations(httpParams).subscribe((reservations) => {
        if (reservations) {
          this.reservations = reservations;
          this.globals.isLoading = false;
        } else {
          this.globals.isLoading = false;
          this._snackBar.open('Die Reservationen konnten nicht geladen werden.', 'Schliessen');
        }
      });
    } else {
      this.globals.isLoading = false;
      this._snackBar.open('Die Reservationen konnten nicht geladen werden.', 'Schliessen');
    }
  }
}
