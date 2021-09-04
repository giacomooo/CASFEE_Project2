import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


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

  async readParkings() {
    let readParkings = new Promise((resolve, reject) => {
      this.http.get(this.url + 'parking/', this.getHttpHeaderResponse()).toPromise().then(
        res => {
          console.log(res);
          resolve(res);
        }
      );
    });
    return readParkings;
  }
}

export interface IParking {
  id: number;
  is_enable: boolean;
  street: string;
}
