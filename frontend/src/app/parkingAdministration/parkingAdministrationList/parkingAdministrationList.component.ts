import { Component, Input, OnInit } from '@angular/core';
import { Parking } from 'src/app/models/Parking';

@Component({
  selector: 'app-parkingAdministrationList',
  templateUrl: './parkingAdministrationList.component.html',
  styleUrls: ['./parkingAdministrationList.component.scss']
})
export class ParkingAdministrationListComponent implements OnInit {

  @Input() public parkings?: Parking[];
  constructor() { }

  ngOnInit() {
  }

}
