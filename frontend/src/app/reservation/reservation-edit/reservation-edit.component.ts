import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Globals } from 'src/app/globals';
import { Reservation } from 'src/app/models/Reservation';
import { ReservationService } from 'src/app/services/reservation.service';
import { ModalComponent } from 'src/shared/modal/modal.component';

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
      DateTimeFrom: new FormControl(this.reservation.DateTimeFrom),
      DateTimeTo: new FormControl(this.reservation.DateTimeTo),
      ID_Parking: new FormControl(this.reservation.ID_Parking),
      IsCanceled: new FormControl(this.reservation.IsCanceled),
      Amount: new FormControl(this.reservation.Amount),
      PricePerHour: new FormControl(this.reservation.PricePerHour),
    });
  }

  ngOnInit(): void {
    this.readReservations();
  }

  readReservations(): void {
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

    if (reservation.id) {
      this._reservationService
        .updateReservation(this.reservationForm.value)
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
    // if(this.reservationForm.controls.id){
    // kann das überhaupt noch sein?
    // }
  }

  showError(content: string) {
    this._snackBar.open(content, 'Schliessen', { duration: 5000 });
  }

  openModal() {
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
