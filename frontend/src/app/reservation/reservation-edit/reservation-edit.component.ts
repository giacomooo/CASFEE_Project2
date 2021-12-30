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
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import * as moment from 'moment';
import { Globals } from 'src/app/globals';
import { Parking } from 'src/app/models/Parking';
import { Reservation } from 'src/app/models/Reservation';
import { ReservationService } from 'src/app/services/reservation.service';
import { dateBeforeValidator } from 'src/app/shared/common-validators/dateBefore-validators.directive';
import { dateInPastValidator } from 'src/app/shared/common-validators/dateInPast-validators.directive';
import { AsyncService } from 'src/app/shared/common-validators/existsReservation-validators.directive';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-reservation-edit',
  templateUrl: './reservation-edit.component.html',
  styleUrls: ['./reservation-edit.component.scss'],
})
export class ReservationEditComponent implements AfterContentInit {
  @Input() public parking: Parking | undefined;
  @ViewChild('fromPicker') fromPicker: unknown;
  @ViewChild('toPicker') picker: unknown;
  public reservation: Reservation;
  public reservationForm: FormGroup;
  public isServerPending = false;
  private readonly indexFirstItem = 0;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _reservationService: ReservationService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
    public globals: Globals,
    private _keycloakAngular: KeycloakService,
    public matDialog: MatDialog,
    private asyncService: AsyncService,
  ) {
    this.reservation = new Reservation();
    this.reservation.ID_Parking = new Parking();
    this.reservationForm = this._formBuilder.group({
      id: new FormControl(this.reservation.id),
      ID_Renter: new FormControl(this.reservation.ID_Renter),
      DateTimeFrom: new FormControl(this.reservation.DateTimeFrom, [Validators.required, dateInPastValidator]),
      DateTimeTo: new FormControl(this.reservation.DateTimeTo, [Validators.required, dateInPastValidator]),
      ID_Parking: new FormControl(this.reservation.Parking?.id),
      IsCanceled: new FormControl(this.reservation.IsCanceled),
      Amount: new FormControl({ value: this.reservation.Amount, disabled: true }),
      PricePerHour: new FormControl({ value: this.reservation.PricePerHour, disabled: true }),
    });
    this.reservationForm.addValidators(dateBeforeValidator('DateTimeFrom', 'DateTimeTo'));
    this.reservationForm.addValidators(asyncService.existsReservationValidator('ID_Parking', 'id', 'DateTimeFrom', 'DateTimeTo'));
    this.onValueChanges();
  }

  ngAfterContentInit(): void {
    if (this.parking) {
      this.initNewReservation(this.parking);
      return;
    }
    this.readReservations();
  }

  private onValueChanges(): void {
    this.reservationForm.controls.DateTimeFrom.valueChanges.subscribe(
      (dateTimeFrom) => {
        this.reservation.DateTimeFrom = dateTimeFrom;
        this.reservation.Amount = this.calculateDiff(dateTimeFrom, this.reservation.DateTimeTo);
      },
    );

    this.reservationForm.controls.DateTimeTo.valueChanges.subscribe(
      (dateTimeTo) => {
        this.reservation.Amount = this.calculateDiff(this.reservation.DateTimeFrom, dateTimeTo);
        this.reservation.DateTimeTo = dateTimeTo;
      },
    );
  }

  private initNewReservation(parking: Parking): void {
    this.reservation.ID_Parking.id = parking.id ?? 0;
    this.reservation.ID_Renter = this._keycloakAngular.getKeycloakInstance().subject ?? '';
    this.reservation.DateTimeFrom = new Date();
    this.reservation.DateTimeFrom.setTime(this.reservation.DateTimeFrom.getTime() + (5 * 60 * 1000) /* plus 5 Minuten */);

    this.reservation.DateTimeTo = new Date();
    this.reservation.DateTimeTo.setTime(this.reservation.DateTimeFrom.getTime() + (1 * 60 * 60 * 1000) /* plus eine Stunde */);
    this.reservation.PricePerHour = parking.PricePerHour ?? 1.0;
    this.reservation.IsCanceled = false;
    this.reservation.Amount = this.calculateDiff(this.reservation.DateTimeFrom, this.reservation.DateTimeTo);
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

  public onEdit(reservation: Reservation): void {
    this.isServerPending = true;
    this.reservation.DateTimeFrom = new Date(moment(reservation.DateTimeFrom).toDate());
    this.reservation.DateTimeTo = new Date(moment(reservation.DateTimeTo).toDate());
    this._reservationService
      .updateReservation(this.reservation)
      .subscribe((result) => {
        if (result) {
          this._router.navigate(['reservation']);
        } else {
          this.showError('Die Reservation konnte nicht gespeichert werden.');
        }
      });
  }

  public deleteReservation(id: number): void {
    const modalDialog = this.openModal();
    modalDialog.afterClosed().subscribe((result) => {
      if (result && id) {
        this._reservationService
          .deleteReservation(id)
          .then((msg) => {
            if (msg.status) {
              this._router.navigate(['reservation']);
            } else {
              this.showError(msg.message);
            }
          })
          .catch(() => {
            this.showError(
              'Die Reservation konnte nicht gelöscht werden, bitte versuchen sie es später erneut.',
            );
          });
      }
    });
  }

    resetForm = (): void => {
      this.reservationForm.reset();
      this.reservationForm.markAsUntouched();

      if (this.reservationForm.controls.id) {
        this.readReservations();
      }
    };

    public showError(content: string): void {
      this._snackBar.open(content, 'Schliessen', { duration: 5000 });
    }

    public calculateDiff(from: Date, to: Date): number {
      const _from = new Date(from);
      const _to = new Date(to);

      const minutes = Math.floor(
        (Date.UTC(_to.getFullYear(), _to.getMonth(), _to.getDate(), _to.getHours(), _to.getMinutes())
        - Date.UTC(_from.getFullYear(), _from.getMonth(), _from.getDate(), _from.getHours(), _from.getMinutes()))
        / (1000 * 60),
      );
      const pricePerMinute = this.reservation.PricePerHour / 60;
      const amount = (Math.round((pricePerMinute * minutes) * 20)) * 0.05;
      return (Math.floor(amount * 100)) / 100;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public openModal() {
      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = true;
      dialogConfig.id = 'modal-component';
      dialogConfig.height = '170px';
      dialogConfig.width = '550px';
      dialogConfig.data = {
        title: 'Wollen sie die Reservation wirklich löschen?',
        description: 'Dieser Vorgang kann nicht rückgängig gemacht werden.',
      };

      return this.matDialog.open(ModalComponent, dialogConfig);
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    get f() {
      return this.reservationForm.controls;
    }
}
