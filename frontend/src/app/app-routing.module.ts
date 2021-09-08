import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { ParkingComponent } from './parking/parking.component';
import { ReservationComponent } from './reservation/reservation.component';
import { AppAuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: 'parking', component: ParkingComponent},
  { path: 'reservation', component: ReservationComponent, canActivate: [AppAuthGuard]},
  { path: 'account', component: AccountComponent, canActivate: [AppAuthGuard]},
  { path: '', redirectTo: '/parking', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AppAuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
