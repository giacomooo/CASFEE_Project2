import { Component, OnInit } from '@angular/core';
import {
  FormBuilder, FormControl, FormGroup, Validators,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Globals } from 'src/app/globals';
import { Parking } from 'src/app/models/Parking';
import { ParkingService } from 'src/app/services/parking.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-parkingAdministrationItemEdit',
  templateUrl: './parkingAdministrationItemEdit.component.html',
  styleUrls: ['./parkingAdministrationItemEdit.component.scss'],
})
export class ParkingAdministrationItemEditComponent implements OnInit {
  public submitted = false;
  public parking: Parking;
  public parkingForm: FormGroup;

  constructor(
    public matDialog: MatDialog,
    private _parkingService: ParkingService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _keycloakAngular: KeycloakService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public globals: Globals,
  ) {
    this.parking = new Parking();
    this.parkingForm = this._formBuilder.group({
      id: new FormControl(this.parking.id),
      ID_Landlord: new FormControl(this.parking.ID_Landlord),
      Street: new FormControl(this.parking.Street, Validators.required),
      StreetNo: new FormControl(this.parking.StreetNo, Validators.required),
      StreetNoSuffix: new FormControl(this.parking.StreetNoSuffix),
      ZIP: new FormControl(this.parking.ZIP, Validators.required),
      Location: new FormControl(this.parking.Location, Validators.required),
      PricePerHour: new FormControl(this.parking.PricePerHour, Validators.required),
    });
  }

  ngOnInit() {
    this.readParking();
  }

  readParking() {
    this.globals.isLoading = true;
    const { id } = this._activatedRoute.snapshot.params;
    if (id && id !== 'create') {
      this.parking.id = id;
    }

    if (this.parking.id) {
      this._parkingService.readParking(id).subscribe((result) => {
        this.parking = result;
        this.parkingForm.reset(this.parking);
        this.globals.isLoading = false;
      });
    } else {
      this.globals.isLoading = false;
    }
  }

  onAddOrEdit(parking: Parking) {
    this.submitted = true;

    if (parking.id) {
      this._parkingService.updateParking(this.parkingForm.value).subscribe((result) => {
        if (result) {
          this._router.navigate(['parkingAdministration']);
        } else {
          this.showError('Der Parkplatz konnte nicht aktualisiert werden.');
        }
      });
    } else {
      const idLandlord = this._keycloakAngular.getKeycloakInstance().subject;
      if (idLandlord) {
        this.parking = this.parkingForm.value;
        this.parking.ID_Landlord = idLandlord;
        this._parkingService.createParking(this.parking).subscribe((result) => {
          if (result) {
            this._router.navigate(['parkingAdministration']);
          } else {
            this.showError('Der Parkplatz konnte nicht hinzugefügt werden.');
          }
        });
      }
    }
  }

  deleteParking(id?: number) {
    const modalDialog = this.openModal();
    modalDialog.afterClosed().subscribe((result) => {
      if (result && id) {
        this._parkingService.deleteParking(id)
          .then((res) => {
            if (res.status) {
              this._router.navigate(['parkingAdministration']);
            } else {
              this.showError(result.message);
            }
          })
          .catch(() => {
            this.showError('Der Parkplatz konnte nicht gelöscht werden, bitte versuchen sie es später erneut.');
          });
      }
    });
  }

  showError(content: string) {
    this._snackBar.open(content, 'Schliessen', { duration: 5000 });
  }

  resetForm = (): void => {
    this.parkingForm.reset();
    this.parkingForm.markAsUntouched();

    if (this.parkingForm.controls.id) {
      this.readParking();
    }
  };

  openModal() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    dialogConfig.height = '170px';
    dialogConfig.width = '550px';
    dialogConfig.data = {
      title: 'Wollen sie den Parkplatz wirklich löschen?',
      description: 'Dieser Vorgang kann nicht rückgängig gemacht werden.',
    };

    return this.matDialog.open(ModalComponent, dialogConfig);
  }

  get f() { return this.parkingForm.controls; }
}
