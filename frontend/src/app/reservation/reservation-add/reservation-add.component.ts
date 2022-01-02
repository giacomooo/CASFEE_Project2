import { HttpParams } from '@angular/common/http';
import {
  AfterContentInit,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder, FormControl, FormGroup, Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { BehaviorSubject } from 'rxjs';
import { Globals } from 'src/app/globals';
import { Parking } from 'src/app/models/Parking';
import { Reservation } from 'src/app/models/Reservation';
import { ReservationService } from 'src/app/services/reservation.service';
import { dateBeforeValidator } from 'src/app/shared/common-validators/dateBefore-validators.directive';
import { dateInPastValidator } from 'src/app/shared/common-validators/dateInPast-validators.directive';
import { ExistsReservationValidator } from 'src/app/shared/common-validators/existsReservation-validators.directive';

@Component({
  selector: 'app-reservation-add',
  templateUrl: './reservation-add.component.html',
  styleUrls: ['./reservation-add.component.scss'],
})

export class ReservationAddComponent implements AfterContentInit {
  @Input() public parking: Parking | undefined;
  @ViewChild('fromPicker') fromPicker: unknown;
  @ViewChild('toPicker') picker: unknown;
  public reservation: Reservation;
  public reservationForm: FormGroup;
  public isServerPending = false;
  private readonly indexFirstItem = 0;
  public buttonCaption$: BehaviorSubject<string> = new BehaviorSubject<string>('wait and see ->');

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _reservationService: ReservationService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
    public globals: Globals,
    private _keycloakAngular: KeycloakService,
    public matDialog: MatDialog,
    private readonly existsReservationValidator: ExistsReservationValidator,
  ) {
    this.reservation = new Reservation();
    this.reservation.ID_Parking = this.parking ?? new Parking();
    this.reservationForm = this._formBuilder.group({
      id: new FormControl(this.reservation.id),
      ID_Renter: new FormControl(this.reservation.ID_Renter),
      DateTimeFrom: new FormControl(this.reservation.DateTimeFrom, [Validators.required, dateInPastValidator]),
      DateTimeTo: new FormControl(this.reservation.DateTimeTo, [Validators.required, dateInPastValidator]),
      ID_Parking: new FormControl(this.reservation.ID_Parking?.id),
      Amount: new FormControl({ value: this.reservation.Amount, disabled: true }),
      PricePerHour: new FormControl({ value: this.reservation.PricePerHour, disabled: true }),
    });
    this.reservationForm.addValidators(dateBeforeValidator('DateTimeFrom', 'DateTimeTo'));
    this.reservationForm.addValidators(existsReservationValidator.validate('ID_Parking', 'id', 'DateTimeFrom', 'DateTimeTo'));
    this.onValueChanges();
  }

  ngAfterContentInit(): void {
    this.initNewReservation(this.parking);
  }

  private onValueChanges(): void {
    this.reservationForm.controls.DateTimeFrom.valueChanges.subscribe(
      (dateTimeFrom) => {
        this.reservation.DateTimeFrom = dateTimeFrom;
        this.reservation.Amount = this.getAmountByDateRange(dateTimeFrom, this.reservation.DateTimeTo);
        this.buttonCaption$.next(this.getButtonCaption(dateTimeFrom, this.reservation.DateTimeTo));
      },
    );

    this.reservationForm.controls.DateTimeTo.valueChanges.subscribe(
      (dateTimeTo) => {
        this.reservation.DateTimeTo = dateTimeTo;
        this.reservation.Amount = this.getAmountByDateRange(this.reservation.DateTimeFrom, dateTimeTo);
        this.buttonCaption$.next(this.getButtonCaption(this.reservation.DateTimeFrom, dateTimeTo));
      },
    );
  }

  private initNewReservation(parking: Parking | undefined): void {
    this.reservation.id = 0;
    this.reservation.ID_Parking.id = parking?.id ?? 0;
    this.reservation.ID_Renter = this._keycloakAngular.getKeycloakInstance().subject ?? '';
    this.reservation.DateTimeFrom = new Date();
    this.reservation.DateTimeFrom.setTime(this.reservation.DateTimeFrom.getTime() + (5 * 60 * 1000) /* plus 5 Minuten */);

    this.reservation.DateTimeTo = new Date();
    this.reservation.DateTimeTo.setTime(this.reservation.DateTimeFrom.getTime() + (1 * 60 * 60 * 1000) /* plus eine Stunde */);
    this.reservation.PricePerHour = parking?.PricePerHour ?? 1.0;
    this.reservation.Amount = this.getAmountByDateRange(this.reservation.DateTimeFrom, this.reservation.DateTimeTo);
    this.reservationForm.reset(this.reservation);
  }

  public readReservations(): void {
    this.globals.isLoading = true;
    const { id } = this._activatedRoute.snapshot.params;

    if (id) {
      const httpParams = new HttpParams().set('id', id);
      this._reservationService
        .readReservations(httpParams)
        .subscribe((result) => {
          this.reservation = result[this.indexFirstItem];
          this.reservationForm.reset(this.reservation);
          this.globals.isLoading = false;
        });
    } else {
      this.globals.isLoading = false;
    }
  }

  public onAdd(): void {
    this.isServerPending = true;

    const idRenter = this._keycloakAngular.getKeycloakInstance().subject;

    if (idRenter) {
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

  public showError(content: string): void {
    this._snackBar.open(content, 'Schliessen', { duration: 5000 });
  }

  private getAmountByDateRange(from: Date, to: Date): number {
    const minutes = this.getMinutesByDateRange(from, to);
    const pricePerMinute = this.reservation.PricePerHour / 60;
    const amount = Math.round((pricePerMinute * minutes) * 20) * 0.05;
    return (Math.floor(amount * 100)) / 100;
  }

  // eslint-disable-next-line class-methods-use-this
  private getMinutesByDateRange(_from: Date, _to: Date): number {
    const from = new Date(_from);
    const to = new Date(_to);
    return Math.floor(
      (Date.UTC(to.getFullYear(), to.getMonth(), to.getDate(), to.getHours(), to.getMinutes())
      - Date.UTC(from.getFullYear(), from.getMonth(), from.getDate(), from.getHours(), from.getMinutes()))
      / (1000 * 60),
    );
  }

  private getButtonCaption(from: Date, to: Date): string {
    const amount = this.getAmountByDateRange(from, to);
    const minTotal = this.getMinutesByDateRange(from, to);
    const hours = Math.floor(minTotal / 60);
    const min = (minTotal - (hours * 60));
    let result = ` für ${amount.toFixed(2)} CHF ->`;

    if (min > 0) {
      result = `${min}min ${result}`;
    }

    if (hours > 0) {
      result = `${hours}h ${result}`;
    }

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  get f() {
    return this.reservationForm.controls;
  }
}
