import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Parking } from '../models/Parking';


@Injectable({
  providedIn: 'root'
})
export class ParkingService {
  private url: String;

  constructor(private http: HttpClient) {
    this.url = environment.backendUrl;
  }

  private getHttpHeaders(){
    return new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*',
    })
  }

  private getHttpHeaderResponse(){
    return new HttpHeaderResponse({headers: this.getHttpHeaders()});
  }

  public readParkings(search?: string | null): Observable<Parking[]> {
    let readParkings = this.http.get<Parking[]>(`${this.url}parking/?search=${search}`, this.getHttpHeaderResponse());
    readParkings.subscribe((result) => {
      console.log('loaded');
    })
    return readParkings;
  }
}

export interface IParking {
  id: number;
  is_enable: boolean;
  street: string;
}
