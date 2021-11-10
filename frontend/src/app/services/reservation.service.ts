import {HttpClient, HttpHeaderResponse, HttpHeaders, HttpParams,} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {Observable, of} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Parking} from '../models/Parking';
import {Reservation} from '../models/Reservation';

@Injectable({providedIn: 'root'})
export class ReservationService {
  private url: String;

  constructor(
    private http: HttpClient,
    protected keycloakAngular: KeycloakService
  ) {
    this.url = environment.backendUrl;
  }

  // private getHttpHeaders() {
  //   return new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: 'Bearer ' + this.keycloakAngular.getToken(),
  //   });
  // }

  // private getHttpHeaderResponse() {
  //   return new HttpHeaderResponse({headers: this.getHttpHeaders()});
  // }

  public readReservations(search?: HttpParams | null): Observable<Reservation[]> {

    console.warn("readRes:", search);

     //let readReservations = this.http.get<Reservation[]>(`${this.url}reservation/?search=${search}`, this.getHttpHeaderResponse());
     let readReservations = this.http.get<Reservation[]>(`${this.url}reservation/?search=${search}`);
 //   let readReservations = this.readReservations();
    readReservations.subscribe((result) => {
      console.warn("service read", result);
    })

    return readReservations;
  }

  // public readReservation(reservationId: number): Observable<Reservation> {
  //   console.log("read1", reservationId);
  //   // const x: Observable<Reservation> = this.readReservations().subscribe(r => r.filter(x => x.id === reservationId));
  //   const x: Reservation = this.readReservations().subscribe(r => {
  //     r.findIndex(x => x.id === reservationId)
  //     return <Reservation> {
  //       id: x.id,
  //       Amount: 0,
  //       DateTimeTo: new Date(),
  //       DateTimeFrom: new Date(),
  //       ID_parking: 2,
  //       Parking: new Parking(),
  //       ID_Renter: 1,
  //       IsCanceled: false,
  //       PricePerHour: 4
  //     };
  //   });

  //   console.log("readx:", x);
  //   // return x;

  //   const result: Reservation = {
  //     id: 89,
  //     Amount: 0,
  //     DateTimeTo: new Date(),
  //     DateTimeFrom: new Date(),
  //     ID_parking: 2,
  //     Parking: new Parking(),
  //     ID_Renter: 1,
  //     IsCanceled: false,
  //     PricePerHour: 4
  //   };
  //   console.log("read2", result);
  //   return of(result);
  // }

  public addReservation(reservation: Reservation): Observable<Reservation> {
    let readReservations = this.http.post<Reservation>(
      `${this.url}reservation/`,
      reservation//, this.getHttpHeaderResponse()
    );
    readReservations.subscribe((result) => {
      console.log('added');
    });
    return readReservations;
  }

  public modifyReservation(reservation: Reservation): Observable<Reservation> {
    let readReservations = this.http.put<Reservation>(
      `${this.url}reservation/`,
      reservation//, this.getHttpHeaderResponse()
    );
    readReservations.subscribe((result) => {
      console.log('updated');
    });
    return readReservations;
  }
}
