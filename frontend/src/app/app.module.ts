import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Globals } from 'src/app/globals';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { ReactiveFormsModule } from '@angular/forms';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NativeDateModule } from '@angular/material/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { ParkingComponent } from './parking/parking.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AccountComponent } from './account/account.component';
import { ParkingListComponent } from './parking/parkingList/parkingList.component';
import { ReservationListComponent } from './reservation/reservation-list/reservation-list.component';
import { ParkingAdministrationComponent } from './parkingAdministration/parkingAdministration.component';
import { ParkingAdministrationListComponent } from './parkingAdministration/parkingAdministrationList/parkingAdministrationList.component';
import { ParkingAdministrationItemComponent } from './parkingAdministration/parkingAdministrationItem/parkingAdministrationItem.component';
import { ParkingAdministrationItemEditComponent } from './parkingAdministration/parkingAdministrationItemEdit/parkingAdministrationItemEdit.component';
import { ReservationEditComponent } from './reservation/reservation-edit/reservation-edit.component';
import { NavBottomComponent } from './nav-bottom/nav-bottom.component';
import { ReservationAddComponent } from './reservation/reservation-add/reservation-add.component';

// export function keycloakFactory(authService: AuthService) {
//   return () => authService.init();
// }

function initializeKeycloak(keycloak: KeycloakService) {
  return () => keycloak.init({
    config: {
      url: 'https://login-staging.optimatik.ch/auth',
      realm: 'HK CAS FEE',
      clientId: 'PPV',
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: `${window.location.origin}/assets/silent-check-sso.html`,
    },
    bearerExcludedUrls: ['/protocol/openid-connect/token'],
  });
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ParkingComponent,
    ParkingListComponent,
    ReservationComponent,
    AccountComponent,
    ReservationListComponent,
    ParkingAdministrationComponent,
    ParkingAdministrationListComponent,
    ParkingAdministrationItemComponent,
    ParkingAdministrationItemEditComponent,
    ReservationEditComponent,
    ReservationAddComponent,
    NavBottomComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    KeycloakAngularModule,
    LayoutModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatCheckboxModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatDatepickerModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatMomentModule,
    MatProgressBarModule,
    SharedModule,
    MatDatepickerModule,
    NativeDateModule,
  ],
  providers: [{
    provide: APP_INITIALIZER,
    // useFactory: keycloakFactory,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService],
  }, Globals],
  bootstrap: [AppComponent],
})
export class AppModule { }
