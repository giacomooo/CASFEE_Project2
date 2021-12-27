import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DeleteMessage } from '../models/DeleteMessage';
import { CreateReservation, Reservation } from '../models/Reservation';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private url: string;

  constructor(private http: HttpClient, protected keycloakAngular: KeycloakService) {
    this.url = environment.backendUrl;
  }

  public readReservations(search?: HttpParams): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.url}reservation/?${search}`);
  }

  public createReservation(reservation: CreateReservation): Observable<Reservation> {
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
