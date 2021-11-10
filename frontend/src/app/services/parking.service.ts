import { HttpClient, HttpErrorResponse, HttpHeaderResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { TmplAstElement } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DeleteMessage } from '../models/DeleteMessage';
import { Parking } from '../models/Parking';


@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private url: String;

  constructor(private http: HttpClient, protected keycloakAngular: KeycloakService) {
    this.url = environment.backendUrl;
  }

  // private getHttpHeaders(){
  //   return new HttpHeaders({
  //     'Content-Type':  'application/json',
  //     'Authorization': 'Bearer ' + this.keycloakAngular.getToken(),
  //   })
  // }

  // private getHttpHeaderResponse(){
  //   return new HttpHeaderResponse({headers: this.getHttpHeaders()});
  // }

  public readParkings(params: HttpParams): Observable<Parking[]> {
    //return this.http.get<Parking[]>(`${this.url}parking/?${params}`, this.getHttpHeaderResponse());
    return this.http.get<Parking[]>(`${this.url}parking/?${params}`);
  }

  public createParking(parking: Parking): Observable<Parking> {
    //return this.http.post<Parking>(`${this.url}parking/`, parking, this.getHttpHeaderResponse());
    return this.http.post<Parking>(`${this.url}parking/`, parking);
  }

  public updateParking(parking: Parking): Observable<Parking> {
    //return this.http.put<Parking>(`${this.url}parking/${parking.id}/`, parking, this.getHttpHeaderResponse());
    return this.http.put<Parking>(`${this.url}parking/${parking.id}/`, parking);
  }

  public deleteParking(id: number): Promise<DeleteMessage> {
    //return this.http.delete(`${this.url}parking/${id}/`, this.getHttpHeaderResponse()).toPromise()
    return this.http.delete(`${this.url}parking/${id}/`).toPromise()
      .then((result) => {
        return new DeleteMessage(true, '');
      })
      .catch((err) => {
        return new DeleteMessage(false, 'Es existieren bereits Reservationen, der Parkplatz kann nicht gelöscht werden.');
      });
  }
}
