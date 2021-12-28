import { Component, Input } from '@angular/core';
import { Reservation } from 'src/app/models/Reservation';

@Component({
  selector: 'app-reservation-item',
  templateUrl: './reservation-item.component.html',
  styleUrls: ['./reservation-item.component.scss'],
})
export class ReservationItemComponent {
  @Input() public reservation?: Reservation;
}
