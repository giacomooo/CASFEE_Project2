import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Parking } from 'src/app/models/Parking';
import { ParkingService } from 'src/app/services/parking.service';

@Component({
  selector: 'app-parkingAdministrationItem',
  templateUrl: './parkingAdministrationItem.component.html',
  styleUrls: ['./parkingAdministrationItem.component.scss']
})
export class ParkingAdministrationItemComponent implements OnInit {

  @Input() public parking?: Parking;
  constructor(private _parkingService: ParkingService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }
}
