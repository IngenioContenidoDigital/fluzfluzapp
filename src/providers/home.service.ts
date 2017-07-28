import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class HomeService {
  
  private _url: string = WS_BASE + '/getBanner';
  public data: any;

  constructor(public http: Http) {}
  
  public getBanner() {
    return new Promise(resolve => {
      this.http.get(this._url)
        .map(res => res.json())
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err:Response) => {
            this.data = '{"Error": "Error al traer los banners"}';
            resolve(this.data);
          }
        );
    });
  }
  
  public getMapData(latitude:any, longitude:any){
    let url = WS_BASE + '/getAddressMaps';
    let params = new URLSearchParams();
      params.set('latitude', latitude);
      params.set('longitude', longitude);
    return new Promise(resolve => {
      this.http.get(url, { search: params })
        .map(res => res.json())
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err:Response) => {
            this.data = '{"Error": "Error al traer los banners"}';
            resolve(this.data);
          }
        );
    });
  }
}