import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class Redemption {

  private _url: string = WS_BASE+'redemption';
  public userData: any;
    
  constructor(public http: Http) {}

  public setRedemption(value:any) {
    let params = new URLSearchParams();
      params.set('identification', value.n_identification);
      params.set('firts_name', value.firts_name);
      params.set('last_name', value.last_name);
      params.set('card', value.card);
      params.set('account', value.type_acount);
      params.set('bank', value.banco);
      params.set('points', value.fluzTotal);
      params.set('credits', value.totalSavings);

      return new Promise(resolve => {
        this.http.get(this._url, { search: params })
          .map(res => res.json())
          .subscribe(
            data => {
              this.userData = JSON.stringify(data);
              resolve( this.userData );
            },
            (err:Response) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
}