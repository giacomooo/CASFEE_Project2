import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { ParkingComponent } from './parking/parking.component';
import { ReservationComponent } from './reservation/reservation.component';

const routes: Routes = [
  { path: 'parking', component: ParkingComponent },
  { path: 'reservation', component: ReservationComponent },
  { path: 'account', component: AccountComponent },
  { path: '', redirectTo: '/parking', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
