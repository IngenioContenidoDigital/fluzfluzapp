import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';

@Injectable()
export class PaymentBitCoinService {

  private _url: string = WS_BASE+'/getBitPay';
  public headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  public responsePayment: any;
  public dataApplyPoints = {};
  public dataPayment = {};

  constructor(public http: HttpClient) {}

  public getBitPay(id_cart) {
    this.dataPayment["id_cart"] = id_cart;
    let dataApplyPoints = JSON.stringify( this.dataPayment );
    return new Promise((resolve, reject) => {
      this.http.post(this._url, dataApplyPoints)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  public sendPayment(userData,cart) {
    this.dataPayment["id_customer"] = userData.id;
    this.dataPayment["id_cart"] = cart.id;
    let dataPayment = JSON.stringify( this.dataPayment );
    let url = WS_BASE+'payFreeOrder';
    return new Promise((resolve, reject) => {
      this.http.post(url, dataPayment)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
}