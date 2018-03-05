import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class HomeService {
  
  private _url: string = WS_BASE + '/getBanner';
  public data: any;

  constructor(public http: HttpClient) {}
  
  public getBanner() {
    return new Promise(resolve => {
      this.http.get(this._url)
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err) => {
            this.data = '{"Error": "Error al traer los banners"}';
            resolve(this.data);
          }
        );
    });
  }
  
  public getMapData(latitude:any, longitude:any, option:any){
    let url = WS_BASE + '/getAddressMaps';
    let Params = new HttpParams();
    Params = Params.append('latitude', latitude);
    Params = Params.append('longitude', longitude);
    Params = Params.append('option', option);
    return new Promise(resolve => {
      this.http.get(url, { params: Params })
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err) => {
            this.data = '{"Error": "Error al traer los banners"}';
            resolve(this.data);
          }
        );
    });
  }
  
  public getNotificationBarOrders(id_customer:any){
    let url = WS_BASE + '/getNotificationBarOrders';
    let params = new HttpParams().set('id_customer', ""+id_customer);
    return new Promise(resolve => {
      this.http.get(url, { params: params })
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err) => {
            this.data = '{"Error": "Error al traer el estado de ordenes."}';
            resolve(this.data);
          }
        );
    });
  }
  
}