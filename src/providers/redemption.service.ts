import { Injectable } from '@angular/core';
//import { Http, URLSearchParams, Response } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class Redemption {

  private _url: string = WS_BASE+'redemption';
  public userData: any;
    
  constructor(public http: HttpClient) {}

  public setRedemption(id_customer:any, value:any) {
    let params = new HttpParams();
      params.set('id_customer', id_customer);
      params.set('identification', value.n_identification);
      params.set('firts_name', value.firts_name);
      params.set('last_name', value.last_name);
      params.set('card', value.card);
      params.set('account', value.type_acount);
      params.set('bank', value.banco);
      params.set('points', value.fluzTotal);
      params.set('credits', value.totalSavings);
      params.set('typeRedemption', value.typeRedemption);
      params.set('cardVirtual', value.cardVirtual);
      params.set('type_vitual', value.type_vitual);

      return new Promise(resolve => {
        this.http.get(this._url, { params: params })
          .subscribe(
            (data:any) => {
              this.userData = data;
              resolve( this.userData );
            },
            (err) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
}