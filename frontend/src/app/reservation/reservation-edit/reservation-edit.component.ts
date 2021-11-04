import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
//import { DateSelectionModelChange } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
//import { DateTimePickerProps } from '@material-ui/pickers';
//import { KeycloakService } from 'keycloak-angular';
import { Reservation } from 'src/app/models/Reservation';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
  selector: 'app-reservation-edit',
  templateUrl: './reservation-edit.component.html',
  styleUrls: ['./reservation-edit.component.scss'],
})
export class ReservationEditComponent implements OnInit {
  @ViewChild('fromPicker') fromPicker: any;
  @ViewChild('toPicker') picker: any;
  public reservation: Reservation;
  public reservationForm: FormGroup;
  public isServerPending: Boolean = false;


  constructor(
    private _activatedRoute: ActivatedRoute,
    private _reservationService: ReservationService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.reservation = new Reservation();
    this.reservationForm = this._formBuilder.group({
      id: new FormControl(this.reservation.id),
      ID_Renter: new FormControl(this.reservation.ID_Renter),
      DateTimeFrom: new FormControl(this.reservation.DateTimeFrom),
      DateTimeTo: new FormControl(this.reservation.DateTimeTo),
      ID_Parking: new FormControl(this.reservation.ID_Parking),
      IsCanceled: new FormControl(this.reservation.IsCanceled),
      Amount: new FormControl(this.reservation.Amount),
      PricePerHour: new FormControl(this.reservation.PricePerHour),
    });
  }

  ngOnInit(): void {
    this.readReservation();
  }

  public readReservation(): void {
    this._activatedRoute.queryParams.subscribe((params) => {
      if (params.id) {
        const httpParams = new HttpParams().set('id', params.id);
        this._reservationService
          .readReservations(httpParams)
          .subscribe((result) => {
            this.reservation = result[0];
            this.reservationForm.reset(this.reservation);
          });
      }
    });

  }

  public onAddOrEdit(reservation: Reservation) {
    this.isServerPending = true;
    if (reservation.id) {
    } else {
      this._snackBar.open('Add wird noch impelmentiert', 'Schliessen', {
        duration: 5000,
      });
    }
  }

  public deleteReservation(id: number): void {

  }

  public resetForm(): void {
    this.reservationForm.reset();
    this.reservationForm.markAsUntouched();
    // if(this.reservationForm.controls.id){
    // kann das überhaupt noch sein?
    // }
  }

  get f() { return this.reservationForm.controls;  }
}
