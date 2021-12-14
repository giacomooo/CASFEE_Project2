import { HttpParams } from '@angular/common/http';
import {
  AfterContentInit,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { Globals } from 'src/app/globals';
import { Parking } from 'src/app/models/Parking';
import { Reservation } from 'src/app/models/Reservation';
import { ReservationService } from 'src/app/services/reservation.service';
import { dateBeforeValidator } from 'src/app/shared/common-validators/dateBefore-validators.directive';
import { dateInPastValidator } from 'src/app/shared/common-validators/dateInPast-validators.directive';

@Component({
  selector: 'app-reservation-add',
  templateUrl: './reservation-add.component.html',
  styleUrls: ['./reservation-add.component.scss'],
})
export class ReservationAddComponent implements AfterContentInit {
  @Input() public parking: Parking | undefined;
  @ViewChild('fromPicker') fromPicker: any;
  @ViewChild('toPicker') picker: any;
  public reservation: Reservation;
  public reservationForm: FormGroup;
  public isServerPending: Boolean = false;
  public buttonCaption$: BehaviorSubject<string> =  new BehaviorSubject<string>('wait and see ->');

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _reservationService: ReservationService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
    public globals: Globals,
    private _keycloakAngular: KeycloakService,
    public matDialog: MatDialog
  ) {
    this.reservation = new Reservation();
    this.reservation.ID_Parking = new Parking();
    this.reservationForm = this._formBuilder.group({
      id: new FormControl(this.reservation.id),
      ID_Renter: new FormControl(this.reservation.ID_Renter),
      DateTimeFrom: new FormControl(this.reservation.DateTimeFrom, [Validators.required, dateInPastValidator]),
      DateTimeTo: new FormControl(this.reservation.DateTimeTo, [Validators.required, dateInPastValidator,]),
      ID_Parking: new FormControl(this.reservation.ID_Parking?.id),
      IsCanceled: new FormControl(this.reservation.IsCanceled),
      Amount: new FormControl({value: this.reservation.Amount, disabled: true}),
      PricePerHour: new FormControl({value: this.reservation.PricePerHour, disabled: true}),
    });
    this.reservationForm.addValidators(dateBeforeValidator('DateTimeFrom','DateTimeTo'));
    this.onValueChanges();
  }

  ngAfterContentInit(): void {
    if (this.parking){
      this.initNewReservation(this.parking);
      return;
    }
    this.readReservations();
  }

  private onValueChanges(): void {
    this.reservationForm.controls['DateTimeFrom'].valueChanges.subscribe(
      (dateTimeFrom) => {
        this.reservation.Amount = this.getAmountByDateRange(dateTimeFrom, this.reservation.DateTimeTo);
        this.buttonCaption$.next (this.getButtonCaption(dateTimeFrom, this.reservation.DateTimeTo));
      }
    );

    this.reservationForm.controls['DateTimeTo'].valueChanges.subscribe(
      (dateTimeTo) => {
        this.reservation.Amount = this.getAmountByDateRange(this.reservation.DateTimeFrom, dateTimeTo);
        this.buttonCaption$.next (this.getButtonCaption(this.reservation.DateTimeFrom, dateTimeTo));
      }
    );

  }

  private currencyRound(unRounded: number, precision: number = 0.05): number {
    return (Math.round(unRounded / precision))*precision;
  }

  private initNewReservation(parking: Parking): void {

    this.reservation.id = 0;
    this.reservation.ID_Parking = parking;
    this.reservation.ID_Renter = this._keycloakAngular.getKeycloakInstance().subject ?? '';
    this.reservation.DateTimeFrom = new Date();
    this.reservation.DateTimeFrom.setTime(this.reservation.DateTimeFrom.getTime() + (5 * 60 * 1000) /* plus 5 Minuten */ )

    this.reservation.DateTimeTo = new Date();
    this.reservation.DateTimeTo.setTime(this.reservation.DateTimeFrom.getTime() + (1 * 60 * 60 * 1000) /* plus eine Stunde */)
    this.reservation.PricePerHour = parking.PricePerHour ?? 1.0 ;
    this.reservation.IsCanceled = false;
    this.reservation.Amount = this.getAmountByDateRange(this.reservation.DateTimeFrom, this.reservation.DateTimeTo);
    this.reservationForm.reset(this.reservation);
  }

  public readReservations(): void {
    this.globals.isLoading = true;
    const id = this._activatedRoute.snapshot.params['id'];

    if (id) {
      const httpParams = new HttpParams().set('id', id);
      this._reservationService
        .readReservations(httpParams)
        .subscribe((result) => {
          this.reservation = result[0];
          this.reservationForm.reset(this.reservation);
          this.globals.isLoading = false;
        });
    } else {
      this.globals.isLoading = false;
    }
  }

  public onAdd(reservation: Reservation): void {
    this.isServerPending = true;

    reservation.DateTimeFrom = new Date(moment(reservation.DateTimeFrom).toDate());
      const ID_Renter = this._keycloakAngular.getKeycloakInstance().subject;

      if (ID_Renter) {
        reservation.ID_Renter = ID_Renter;

        this._reservationService
          .createReservation(this.reservation)
          .subscribe((result) => {
            if (result) {
              this._router.navigate(['reservation']);
            } else {
              this.showError('Die Resevation konnte nicht hinzugefügt werden.');
            }
          });
      }
  }


  public showError(content: string) {
    this._snackBar.open(content, 'Schliessen', { duration: 5000 });
  }


  public getAmountByDateRange(from: Date, to: Date): number {
    const minutes = this.getMinutesByDateRange(from, to);
      const pricePerMinute = this.reservation.PricePerHour / 60;
      return this.currencyRound(pricePerMinute * minutes);
  }

  public getMinutesByDateRange(_from: Date, _to: Date): number {
    const from = new Date(_from);
    const to = new Date(_to);
    return Math.floor(
      (Date.UTC(to.getFullYear(),to.getMonth(), to.getDate(), to.getHours(),to.getMinutes()) -
      Date.UTC(from.getFullYear(), from.getMonth(), from.getDate(), from.getHours(), from.getMinutes())) /
      (1000 * 60 )
    );
  }

  public getButtonCaption(from: Date, to: Date): string {

    const amount = this.getAmountByDateRange(from,to);
    const minTotal = this.getMinutesByDateRange(from, to);
    const hours = Math.floor(minTotal / 60);
    const min = (minTotal - (hours * 60));
    let result = `${min}min für ${amount.toFixed(2)} CHF ->`;

    if (hours > 0) {
      return `${hours}h ${result}`;
    }

    return result;
  }

  get f() {
    return this.reservationForm.controls;
  }
}
