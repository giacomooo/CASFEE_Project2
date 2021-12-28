import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private readonly keycloak: KeycloakService, private parkingService: ParkingService, private router: Router, private _formBuilder: FormBuilder, public globals: Globals) {
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

  callFromNow() {
    this.router.navigate(['parking', 'list'], { queryParams: { location: this.parkingForm.value.location } });
  }

  callFromTo() {
    this.router.navigate(['parking', 'list'], { queryParams: { location: this.parkingForm.value.location, dateTimeFrom: this.parkingForm.value.dateTimeFrom, duration: this.parkingForm.value.duration } });
  }

  get f() {
    return this.parkingForm.controls;
  }
}
