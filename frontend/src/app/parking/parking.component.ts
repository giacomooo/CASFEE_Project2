import { HttpParams } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Params, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { Globals } from '../globals';
import { ParkingService } from '../services/parking.service';
import { dateInPastValidator } from '../shared/common-validators/dateInPast-validators.directive';

@Component({
  selector: 'app-parking',
  templateUrl: './parking.component.html',
  styleUrls: ['./parking.component.scss'],
})
export class ParkingComponent {
  @ViewChild('fromPicker') fromPicker: any;
  public isLoggedIn = false;
  public userProfile: KeycloakProfile | null = null;
  public parkingForm: FormGroup;
  public alternativeDateTime = false;
  public defaultTime = [new Date().getHours(), 0, 0];

  constructor(
    private readonly keycloak: KeycloakService,
    private _snackBar: MatSnackBar,
    private parkingService: ParkingService,
    private router: Router,
    private _formBuilder: FormBuilder,
    public globals: Globals,
  ) {
    this.parkingForm = this._formBuilder.group({
      location: new FormControl('', Validators.required),
      dateTimeFrom: new FormControl('', [dateInPastValidator]),
      duration: new FormControl(''),
    });

    this.parkingForm.patchValue({ dateTimeFrom: new Date().toISOString().slice(0, 16) });
  }

  ngOnInit() {
    this.initializeParking();
  }

  initializeParking() {
    this.globals.isLoading = true;
    this.parkingForm.reset();
    this.globals.isLoading = false;
  }

  callParkings(withTimeRange: boolean) {
    let httpParams = new HttpParams().set('search', this.parkingForm.value.location);

    if (withTimeRange) {
      httpParams = httpParams.set('dateTimeFrom', this.parkingForm.value.dateTimeFrom).set('duration', this.parkingForm.value.duration);
    }

    this.parkingService.readParkings(httpParams).subscribe((serviceResults) => {
      if (serviceResults.length > 0) {
        if (withTimeRange) {
          this.router.navigate(['parking', 'list'], { queryParams: { search: this.parkingForm.value.location, dateTimeFrom: this.parkingForm.value.dateTimeFrom, duration: this.parkingForm.value.duration } });
        } else {
          this.router.navigate(['parking', 'list'], { queryParams: { search: this.parkingForm.value.location } });
        }
      } else {
        this.showError(`Keine Parkplätze in ${this.parkingForm.value.location} gefunden.`);
      }
    });
  }

  showError(content: string) {
    this._snackBar.open(content, 'Schliessen', { duration: 5000, panelClass: ['red-snackbar'] });
  }

  get f() {
    return this.parkingForm.controls;
  }
}
