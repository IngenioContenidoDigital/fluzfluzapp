import { Injectable } from '@angular/core';
//import { Http, URLSearchParams, Response } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class MapService {
  
  private _url: string = WS_BASE + '/getAddressMaps';
  public data: any;

  constructor(public http: HttpClient) {}
  
  public getMapData(latitude:any, longitude:any, option:any) {
    let Params = new HttpParams();
    Params = Params.append('latitude', latitude);
    Params = Params.append('longitude', longitude);
    Params = Params.append('option', option);
    
    return new Promise(resolve => {
      this.http.get(this._url, { params: Params })
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err) => {
            this.data = '{"Error": "Error al traer los datos del mapa"}';
            resolve(this.data);
          }
        );
    });
  }
}