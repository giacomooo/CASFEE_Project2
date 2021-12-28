import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Globals } from 'src/app/globals';
import { Parking } from 'src/app/models/Parking';
import { Reservation } from 'src/app/models/Reservation';
import { ParkingService } from 'src/app/services/parking.service';

@Component({
  selector: 'app-parking-administration-item-reservations',
  templateUrl: './parking-administration-item-reservations.component.html',
  styleUrls: ['./parking-administration-item-reservations.component.scss'],
})
export class ParkingAdministrationItemReservationsComponent implements OnInit {
  @Input() public parking?: Parking;
  public reservations?: Reservation[];
  public withHistory: boolean = false;

  constructor(
    protected _keycloakAngular: KeycloakService,
    private _snackBar: MatSnackBar,
    private _activatedRoute: ActivatedRoute,
    private _parkingService: ParkingService,
    public globals: Globals,
  ) { }

  async ngOnInit() {
    this.backendCall();
  }

  public backendCall() {
    this.globals.isLoading = true;
    const { id } = this._activatedRoute.snapshot.params;

    this._parkingService.readParkingReservations(id).subscribe((result) => {
      if (result) {
        this.reservations = result;
        this.globals.isLoading = false;
      } else {
        this.globals.isLoading = false;
      }
    });
  }

  public refresh(event: boolean): void {
    this.withHistory = !this.withHistory;
    this.backendCall();
  }
}
