import {
  HttpClient,
  HttpHeaderResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
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

  public readReservations(search?: HttpParams | null): Observable<Reservation[]> {
    let readReservations = this.http.get<Reservation[]>(`${this.url}reservation/?search=${search}`, this.getHttpHeaderResponse());
    readReservations.subscribe((result) => {
    })
    return readReservations;


  }

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
