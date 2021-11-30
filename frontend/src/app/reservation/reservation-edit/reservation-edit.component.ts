import { HttpParams } from '@angular/common/http';
import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import * as moment from 'moment';
import { Globals } from 'src/app/globals';
import { Reservation } from 'src/app/models/Reservation';
import { ReservationService } from 'src/app/services/reservation.service';
import { dateBeforeValidator } from 'src/app/shared/common-validators/dateBefore-validators.directive';
import { dateInPastValidator } from 'src/app/shared/common-validators/dateInPast-validators.directive';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

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

  public id: number = 0;

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
    this.reservationForm = this._formBuilder.group({
      id: new FormControl(this.reservation.id),
      ID_Renter: new FormControl(this.reservation.ID_Renter),
      DateTimeFrom: new FormControl(this.reservation.DateTimeFrom, [Validators.required, dateInPastValidator]),
      DateTimeTo: new FormControl(this.reservation.DateTimeTo, [Validators.required, dateInPastValidator]),
      ID_Parking: new FormControl(this.reservation.ID_Parking),
      IsCanceled: new FormControl(this.reservation.IsCanceled),
      Amount: new FormControl({value: this.reservation.Amount, disabled: true}),
      PricePerHour: new FormControl({value: this.reservation.PricePerHour, disabled: true}),
    });
    this.reservationForm.addValidators(dateBeforeValidator('DateTimeFrom','DateTimeTo'));
    this.onValueChanges();
  }

  public ngOnInit(): void {
    this.readReservations();
  }

  private onValueChanges(): void {
    this.reservationForm.controls['DateTimeFrom'].valueChanges.subscribe(
      (dateTimeFrom) => {
        this.reservation.Amount = this.currencyRound (this.calculateDiff(dateTimeFrom, this.reservation.DateTimeTo));
      }
    );

    this.reservationForm.controls['DateTimeTo'].valueChanges.subscribe(
      (dateTimeTo) => {
        this.reservation.Amount = this.currencyRound(this.calculateDiff(this.reservation.DateTimeFrom, dateTimeTo));
      }
    );

  }

  private currencyRound(unRounded: number, precision: number = 0.05): number {
    return (Math.round(unRounded / precision))*precision;
  }

  public readReservations(): void {
    // this.globals.isLoading = true;
    const id = this._activatedRoute.snapshot.params['id'];

    if (id) {
      const httpParams = new HttpParams().set('id', id);
      this._reservationService
        .readReservations(httpParams)
        .subscribe((result) => {
          this.reservation = result[0];
          this.reservationForm.reset(this.reservation);
          // this.globals.isLoading = false;
        });
    } else {
      // this.globals.isLoading = false;
    }
  }

  public onAddOrEdit(reservation: Reservation): void {
    this.isServerPending = true;

    reservation.DateTimeFrom = new Date(moment(reservation.DateTimeFrom).toDate());
    if (reservation.id) {
      this._reservationService
        .updateReservation(this.reservation)
        .subscribe((result) => {
          if (result) {
            this._router.navigate(['reservation']);
          } else {
            this.showError('Die Reservation konnte nicht gespeichert werden.');
          }
        });
    } else {
      const ID_Renter = this._keycloakAngular.getKeycloakInstance().subject;
      if (ID_Renter) {
        reservation.ID_Renter = ID_Renter;
        this._reservationService
          .createReservation(this.reservationForm.value)
          .subscribe((result) => {
            if (result) {
              this._router.navigate(['reservation']);
            } else {
              this.showError('Die Resevation konnte nicht hinzugefügt werden.');
            }
          });
      }
    }
  }

  public deleteReservation(id: number): void {
    const modalDialog = this.openModal();
    modalDialog.afterClosed().subscribe((result) => {
      if (result && id) {
        this._reservationService
          .deleteReservation(id)
          .then((result) => {
            console.log('delete', result);
            if (result.status) {
              this._router.navigate(['reservation']);
            } else {
              this.showError(result.message);
            }
          })
          .catch((error) => {
            this.showError(
              'Die Reservation konnte nicht gelöscht werden, bitte versuchen sie es später erneut.'
            );
          });
      }
    });
  }

  public resetForm(): void {
    this.reservationForm.reset();
    this.reservationForm.markAsUntouched();
  }

  public showError(content: string) {
    this._snackBar.open(content, 'Schliessen', { duration: 5000 });
  }

  public calculateDiff(from: Date, to: Date): number {
    const _from = new Date(from);
    const _to = new Date(to);

    const minutes = Math.floor(
      (Date.UTC(_to.getFullYear(), _to.getMonth(), _to.getDate(), _to.getHours(),_to.getMinutes()) -
        Date.UTC(_from.getFullYear(), _from.getMonth(), _from.getDate(), _from.getHours(), _from.getMinutes())) /
        (1000 * 60 )
    );
    const pricePerMinute = this.reservation.PricePerHour / 60;
    return pricePerMinute * minutes;
  }

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

  get f() {
    return this.reservationForm.controls;
  }
}
