import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Parking } from 'src/app/models/Parking';
import { ParkingService } from 'src/app/services/parking.service';
import { ParkingComponent } from '../parking.component';

@Component({
  selector: 'app-parkingList',
  templateUrl: './parkingList.component.html',
  styleUrls: ['./parkingList.component.scss']
})
export class ParkingListComponent implements OnInit {
  public parkings?: Parking[];
  private searchQuery: string | null = '';

  constructor(private parkingService: ParkingService, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['location'];
    })
  }

  ngOnInit() {
    this.parkingService.readParkings(this.searchQuery).subscribe(result => {
      this.parkings = result;
    });
  }

}
