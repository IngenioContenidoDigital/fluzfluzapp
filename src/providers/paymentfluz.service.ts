import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';


@Injectable()
export class PaymentFluzService {
  private _url: string = WS_BASE+'cart';
  public headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  public responsePayment: any;
  public dataApplyPoints = {};
  public dataPayment = {};

  constructor(public http: HttpClient) {}

  public applyPoints(user,cart,points) {
    this.dataApplyPoints["option"] = 3;
    this.dataApplyPoints["id_customer"] = user;
    this.dataApplyPoints["cart"] = cart;
    this.dataApplyPoints["points"] = points;
    let dataApplyPoints = JSON.stringify( this.dataApplyPoints );
    return new Promise((resolve, reject) => {
      this.http.post(this._url, {
        headers: this.headers,
        params: dataApplyPoints,
      })
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
      this.http.post(url, {
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