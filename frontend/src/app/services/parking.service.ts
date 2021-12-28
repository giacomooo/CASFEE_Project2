import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DeleteMessage } from '../models/DeleteMessage';
import { Parking } from '../models/Parking';
import { Reservation } from '../models/Reservation';

@Injectable({
  providedIn: 'root',
})
export class ParkingService {
  private url: string;

  constructor(private http: HttpClient) {
    this.url = environment.backendUrl;
  }

  public readParkings(params: HttpParams): Observable<Parking[]> {
    return this.http.get<Parking[]>(`${this.url}parking/?${params}`);
  }

  public readParking(id: number): Observable<Parking> {
    return this.http.get<Parking>(`${this.url}parking/${id}`);
  }

  public createParking(parking: Parking): Observable<Parking> {
    return this.http.post<Parking>(`${this.url}parking/`, parking);
  }

  public updateParking(parking: Parking): Observable<Parking> {
    return this.http.put<Parking>(`${this.url}parking/${parking.id}/`, parking);
  }

  public deleteParking(id: number): Promise<DeleteMessage> {
    return this.http.delete(`${this.url}parking/${id}/`).toPromise()
      .then(() => new DeleteMessage(true, ''))
      .catch(() => new DeleteMessage(false, 'Es existieren bereits Reservationen, der Parkplatz kann nicht gelöscht werden.'));
  }

  public readParkingReservations(id: number) {
    return this.http.get<Reservation[]>(`${this.url}parking/${id}/reservation`);
  }
}
