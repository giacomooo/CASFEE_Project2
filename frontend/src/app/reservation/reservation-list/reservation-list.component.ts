import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule } from '@angular/router';
import {Reservation} from 'src/app/models/Reservation';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent {

  @Input() public reservations?: Reservation[];

  constructor(public readonly router: Router) {
  }

  public clickEdit(reservationId: number): void {
   this.router.navigate(['reservation', reservationId])
  }
}
