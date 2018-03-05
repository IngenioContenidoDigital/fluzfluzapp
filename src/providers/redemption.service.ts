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
    let Params = new HttpParams();
      Params = Params.append('id_customer', id_customer);
      Params = Params.append('identification', value.n_identification);
      Params = Params.append('firts_name', value.firts_name);
      Params = Params.append('last_name', value.last_name);
      Params = Params.append('card', value.card);
      Params = Params.append('account', value.type_acount);
      Params = Params.append('bank', value.banco);
      Params = Params.append('points', value.fluzTotal);
      Params = Params.append('credits', value.totalSavings);
      Params = Params.append('typeRedemption', value.typeRedemption);
      Params = Params.append('cardVirtual', value.cardVirtual);
      Params = Params.append('type_vitual', value.type_vitual);

      return new Promise(resolve => {
        this.http.get(this._url, { params: Params })
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