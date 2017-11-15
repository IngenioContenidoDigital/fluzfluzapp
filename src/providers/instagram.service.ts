import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { WS_BASE } from './config';


@Injectable()
export class InstagramService {
  
  private _url: string = WS_BASE + '/getMediaInstagram';
  public data: any;

  constructor(public http: Http) {}
  
  public getInstagramData( id_manufacturer:any, count:any ) {
    let params = new URLSearchParams();
    params.set('id_manufacturer', id_manufacturer);
    params.set('count', count);
    
    return new Promise(resolve => {
      this.http.get(this._url, { search: params })
        .map(res => res.json())
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err:Response) => {
            this.data = '{"Error": "Error al traer los datos de instagram"}';
            resolve(this.data);
          }
        );
    });
  }
}