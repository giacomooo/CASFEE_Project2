import { Component, Input } from '@angular/core';
import { Parking } from 'src/app/models/Parking';

@Component({
  selector: 'app-parking-administrationList',
  templateUrl: './parkingAdministrationList.component.html',
  styleUrls: ['./parkingAdministrationList.component.scss'],
})
export class ParkingAdministrationListComponent {
  @Input() public parkings?: Parking[];
}
