import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';

@Injectable()
export class CreditCardService {
  private _url: string = WS_BASE+'pay';
  public headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  public responsePayment: any;
  public dataPayment = {};

  constructor(public http: HttpClient) {}
    
  public sendPayment(dataForm, userData, cart) {
    this.dataPayment["namecard"] = dataForm.namecard;
    this.dataPayment["numbercard"] = dataForm.numbercard;
    this.dataPayment["datecard"] = dataForm.datecard;
    this.dataPayment["codecard"] = dataForm.codecard;
    this.dataPayment["checkautorizationcard"] = dataForm.checkautorizationcard;
    this.dataPayment["id_customer"] = userData.id;
    this.dataPayment["id_cart"] = cart.id;
    this.dataPayment["payment"] = 'Tarjeta_credito';

    let dataPayment = JSON.stringify( this.dataPayment );
    return new Promise((resolve, reject) => {
      this.http.post(this._url, {
        headers: this.headers,
        params: dataPayment,
      })
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
}