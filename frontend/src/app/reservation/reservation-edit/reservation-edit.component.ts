import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Reservation } from 'src/app/models/Reservation';
import { ReservationService } from 'src/app/services/reservation.service';

@Component({
  selector: 'app-reservation-edit',
  templateUrl: './reservation-edit.component.html',
  styleUrls: ['./reservation-edit.component.scss']
})
export class ReservationEditComponent implements OnInit {

  @Output() public reservation = new EventEmitter<Reservation>();

  constructor() {
  }

  ngOnInit(): void {

  }
}
