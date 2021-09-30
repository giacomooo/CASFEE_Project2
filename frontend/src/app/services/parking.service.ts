import { HttpClient, HttpHeaderResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Parking } from '../models/Parking';


@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private url: String;

  constructor(private http: HttpClient, protected keycloakAngular: KeycloakService) {
    this.url = environment.backendUrl;
  }

  private getHttpHeaders(){
    return new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + this.keycloakAngular.getToken(),
    })
  }

  private getHttpHeaderResponse(){
    return new HttpHeaderResponse({headers: this.getHttpHeaders()});
  }

  public readParkings(params: HttpParams): Observable<Parking[]> {
    return this.http.get<Parking[]>(`${this.url}parking/?${params}`, this.getHttpHeaderResponse());
  }

  public createParking(parking: Parking): Observable<Parking> {
    return this.http.post<Parking>(`${this.url}parking/`, parking, this.getHttpHeaderResponse());
  }

  public updateParking(parking: Parking): Observable<Parking> {
    return this.http.put<Parking>(`${this.url}parking/${parking.id}/`, parking, this.getHttpHeaderResponse());
  }

  public deleteParking(id: number): Observable<Parking> {
    return this.http.delete<Parking>(`${this.url}parking/${id}/`, this.getHttpHeaderResponse());
  }
}
