import { HttpParams } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Parking } from 'src/app/models/Parking';
import { ParkingService } from 'src/app/services/parking.service';

@Component({
  selector: 'app-parkingAdministrationItemEdit',
  templateUrl: './parkingAdministrationItemEdit.component.html',
  styleUrls: ['./parkingAdministrationItemEdit.component.scss']
})
export class ParkingAdministrationItemEditComponent implements OnInit {
  public submitted: Boolean = false;
  public parking: Parking;
  public parkingForm: FormGroup;

  constructor(private _parkingService: ParkingService, private _router: Router,  private _activatedRoute: ActivatedRoute, private _keycloakAngular: KeycloakService, private _formBuilder: FormBuilder, private _snackBar: MatSnackBar) {
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
    })
  }

  ngOnInit() {
    this.readParking();
  }

  readParking() {
    this._activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
        const httpParams = new HttpParams().set('id', params.id);
        this._parkingService.readParkings(httpParams).subscribe(result => {
          this.parking = result[0];
          this.parkingForm.reset(this.parking);
        });
      }
    })
  }

  onAddOrEdit(parking: Parking) {
    this.submitted = true;

    if (parking.id) {
      this._parkingService.updateParking(this.parkingForm.value).subscribe(result => {
        if (result) {
          this._router.navigate(['parkingAdministration']);
        }
        else {
          this.showError('Der Parkplatz konnte nicht aktualisiert werden.');
        }
      })
    }
    else {
      const ID_Landlord = this._keycloakAngular.getKeycloakInstance().subject;
      if (ID_Landlord) {
        parking.ID_Landlord = ID_Landlord;
        this._parkingService.createParking(this.parkingForm.value).subscribe(result => {
          if (result) {
            this._router.navigate(['parkingAdministration']);
          }
          else {
            this.showError('Der Parkplatz konnte nicht hinzugefügt werden.');
          }
        })
      }
    }
  }

  deleteParking(id?: number) {
    if (id) {
      this._parkingService.deleteParking(id).subscribe(result => {
        if (result) {
          console.warn(result);
        }
        else {
          this.showError('Der Parkplatz konnte nicht gelöscht werden, es existieren bereits Reservierungen.');
        }
      });
    }
    else {
      this.showError('Der Parkplatz konnte nicht gelöscht werden, es existieren bereits Reservierungen.');
    }
  }

  showError(content: string) {
    this._snackBar.open(content, 'Schliessen', { duration: 5000 });
  }

  resetForm() {
    this.parkingForm.reset();
    this.parkingForm.markAsUntouched();

    if (this.parkingForm.controls.id) {
      this.readParking();
    }
  }

  get f() { return this.parkingForm.controls;  }
}
