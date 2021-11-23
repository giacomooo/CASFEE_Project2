import { Component, Input } from '@angular/core';
import { Parking } from 'src/app/models/Parking';

@Component({
  selector: 'app-parkingAdministrationItem',
  templateUrl: './parkingAdministrationItem.component.html',
  styleUrls: ['./parkingAdministrationItem.component.scss'],
})
export class ParkingAdministrationItemComponent {
  @Input() public parking?: Parking;
}
