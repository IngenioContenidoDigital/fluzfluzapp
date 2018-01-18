import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';


@Injectable()
export class InstagramService {
  
  private _url: string = WS_BASE + '/getMediaInstagram';
  public data: any;

  constructor(public http: HttpClient) {}
  
  public getInstagramData( id_manufacturer:any, count:any ) {
    let params = new HttpParams();
    params.set('id_manufacturer', id_manufacturer);
    params.set('count', count);
    
    return new Promise(resolve => {
      this.http.get(this._url, { params: params })
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err) => {
            this.data = '{"Error": "Error al traer los datos de instagram"}';
            resolve(this.data);
          }
        );
    });
  }
}