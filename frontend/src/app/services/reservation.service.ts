import {
  HttpClient,
  HttpHeaderResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Parking } from '../models/Parking';
import { Reservation } from '../models/Reservation';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private url: String;

  constructor(
    private http: HttpClient,
    protected keycloakAngular: KeycloakService
  ) {
    this.url = environment.backendUrl;
  }

  private getHttpHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.keycloakAngular.getToken(),
    });
  }

  private getHttpHeaderResponse() {
    return new HttpHeaderResponse({ headers: this.getHttpHeaders() });
  }

  public readReservations(search?: string | null): Observable<Reservation[]> {
    console.warn(search);
    // let readReservations = this.http.get<Reservation[]>(`${this.url}reservation/?search=${search}`, this.getHttpHeaderResponse());
    // readReservations.subscribe((result) => {
    //   console.log('loaded');
    // })

    const dummyParking: Parking = {
      Location: 'St. Gallen',
      Street: 'Langgasse',
      StreetNo: '23',
      StreetNoSuffix: 'a',
      ZIP: 9000,
      id: 22,
      ID_Landlord: '23',
    };

    const readReservations: Reservation[] = [
      {
        ID_parking: 24,
        ID_Renter: 33,
        PricePerHour: 27,
        DateFrom: new Date('2020-01-02'),
        DateTo: new Date('2020-01-02'),
        id: 897,
        Parking: dummyParking,
        IsCanceled: false
      },
      {
        ID_parking: 21,
        ID_Renter: 33,
        PricePerHour: 2.70,
        DateFrom: new Date('2020-01-02'),
        DateTo: new Date('2020-01-02'),
        id: 899,
        Parking: dummyParking,
        IsCanceled: true
      },
      {
        ID_parking: 24,
        ID_Renter: 33,
        PricePerHour: 5.30,
        DateFrom: new Date('2020-01-02'),
        DateTo: new Date('2020-01-02'),
        id: 894,
        Parking: dummyParking,
        IsCanceled: false
      },

    ];

    return of(readReservations);
  }

  // public readReservations(search?: string | null): Observable<Reservation[]> {
  //   console.warn(search);
  //   let readReservations = this.http.get<Reservation[]>(`${this.url}reservation/?search=${search}`, this.getHttpHeaderResponse());
  //   readReservations.subscribe((result) => {
  //     console.log('loaded');
  //   })
  //   return readReservations;
  // }

  public AddReservation(reservation: Reservation): Observable<Reservation> {
    let readReservations = this.http.post<Reservation>(
      `${this.url}reservation/`,
      reservation,
      this.getHttpHeaderResponse()
    );
    readReservations.subscribe((result) => {
      console.log('added');
    });
    return readReservations;
  }

  public ModifyReservation(reservation: Reservation): Observable<Reservation> {
    let readReservations = this.http.put<Reservation>(
      `${this.url}reservation/`,
      reservation,
      this.getHttpHeaderResponse()
    );
    readReservations.subscribe((result) => {
      console.log('updated');
    });
    return readReservations;
  }
}
