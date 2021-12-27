import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParkListItem } from 'src/app/models/Parking';
import { ParkingService } from 'src/app/services/parking.service';

@Component({
  selector: 'app-parkingList',
  templateUrl: './parkingList.component.html',
  styleUrls: ['./parkingList.component.scss'],
})
export class ParkingListComponent implements OnInit {
  public parkings: ParkListItem[] = [];
  private searchQuery: string | null = '';
  public IsReservationPending: boolean = false;

  constructor(
    private parkingService: ParkingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const httpParams = new HttpParams().set('Location', 'Appenzell');
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      this.searchQuery = params['location'];
      console.log(this.searchQuery);
    });

    this.parkingService.readParkings(httpParams).subscribe((serviceResults) => {
      serviceResults.map((parking) => {
        const parkItem: ParkListItem = { parking: parking, isPending: false };
        this.parkings?.push(parkItem);
      });
    });

  }

  public onAddReservation(ID_Parking: number | undefined): void {
    let specificItem = this.parkings.find((existingItem) => existingItem.parking?.id === ID_Parking);
    if (specificItem === undefined) return;
    specificItem.isPending = !specificItem.isPending;
  }
}
