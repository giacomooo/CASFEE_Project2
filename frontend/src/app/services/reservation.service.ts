import {HttpClient, HttpHeaderResponse, HttpHeaders, HttpParams,} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {Observable, of} from 'rxjs';
import {environment} from 'src/environments/environment';
import { DeleteMessage } from '../models/DeleteMessage';
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

  private getHttpHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.keycloakAngular.getToken(),
    });
  }

  private getHttpHeaderResponse() {
    return new HttpHeaderResponse({headers: this.getHttpHeaders()});
  }

  public readReservations(search?: HttpParams): Observable<Reservation[]> {
     return this.http.get<Reservation[]>(`${this.url}reservation/?${search}`, this.getHttpHeaderResponse());
  }

  public createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.url}reservation/`, reservation, this.getHttpHeaderResponse());
  }

  public updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.url}reservation/${reservation.id}/`, reservation, this.getHttpHeaderResponse());
  }

  public deleteReservation(id: number): Promise<DeleteMessage> {
    return this.http.delete<Reservation>(`${this.url}reservation/${id}`, this.getHttpHeaderResponse()).toPromise()
    .then((result) => {
      return new DeleteMessage(true, '');
    })
    .catch((err) => {
      return new DeleteMessage(false, 'Die Reservation konnte nicht gelöscht werden.')
    })
  }
}
