import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Reservation } from '../models/Reservation';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})

export class ReservationComponent implements OnInit, OnDestroy {
  public reservations?: Reservation[];
  public searchQuery?: string;

  constructor(private readonly reservationService: ReservationService) {
  }

  ngOnInit(): void {
    this.reservationService.readReservations(this.searchQuery).subscribe(result => this.reservations = result);
  }

  ngOnDestroy(): void {
  }
}
