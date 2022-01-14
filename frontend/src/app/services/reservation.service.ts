import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DeleteMessage } from '../models/DeleteMessage';
import { Reservation } from '../models/Reservation';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private url: string;

  constructor(private http: HttpClient, protected keycloakAngular: KeycloakService) {
    this.url = environment.backendUrl;
  }

  public readReservations(search?: HttpParams): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.url}reservation/?${search}`).pipe(
      map((results) => {
        results.map((serviceResult) => {
          const reservation = serviceResult;
          const dateTimeFrom = new Date(serviceResult.DateTimeFrom);
          const dateTimeTo = new Date(serviceResult.DateTimeTo);
          reservation.DateTimeFrom = new Date(dateTimeFrom.setHours(dateTimeFrom.getHours() - (dateTimeFrom.getTimezoneOffset() / 60)));
          reservation.DateTimeTo = new Date(dateTimeTo.setHours(dateTimeTo.getHours() - (dateTimeTo.getTimezoneOffset() / 60)));
          return reservation;
        });
        return results;
      }),
    );
  }

  public createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.url}reservation/`, reservation);
  }

  public updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.url}reservation/${reservation.id}/`, reservation);
  }

  public deleteReservation(id: number): Promise<DeleteMessage> {
    return this.http.delete<Reservation>(`${this.url}reservation/${id}`).toPromise()
      .then(() => new DeleteMessage(true, 'Die Reservation wurde gelöscht.'))
      .catch(() => new DeleteMessage(false, 'Die Reservation konnte nicht gelöscht werden.'));
  }
}
