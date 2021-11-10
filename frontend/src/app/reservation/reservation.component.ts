import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KeycloakService } from 'keycloak-angular';
import { Globals } from '../globals';
import { Reservation } from '../models/Reservation';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})

export class ReservationComponent implements OnInit, OnDestroy {
  public reservations?: Reservation[];
  public withHistory: boolean = false;

  constructor(private readonly _reservationService: ReservationService, protected _keycloakAngular: KeycloakService, private _snackBar: MatSnackBar, public globals: Globals) {
    // do nothing
  }

  async ngOnInit() {
    this.backendCall();
  }

  public refresh(event: Boolean): void {
    this.withHistory = !this.withHistory;
    this.backendCall();
  }

  public async backendCall() {
    this.globals.isLoading = true;
    const id_landlord = await this._keycloakAngular.getKeycloakInstance().subject;
    if (id_landlord && id_landlord?.length > 0) {
      const httpParams = new HttpParams().set('ID_Landlord', id_landlord).set('withHistory', this.withHistory) ;

      this._reservationService.readReservations(httpParams).subscribe(result => {
        this.reservations = result;
        this.globals.isLoading = false;
      });
    }
    else {
      this.globals.isLoading = false;
      this._snackBar.open('Die Reservationen konnten nicht geladen werden.', 'Schliessen');
    }
  }

  ngOnDestroy(): void {
    // do nothing
  }
}
