import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class PaymentPseService {
  private _url: string = WS_BASE+'pay';
  public headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  public responsePayment: any;
  public dataPayment = {};

  constructor(public http: HttpClient) {}

  public sendPayment(dataForm, bankname, userData, cart) {
    this.dataPayment["bank"] = dataForm.bank;
    this.dataPayment["bankname"] = bankname;
    this.dataPayment["typecustomer"] = dataForm.typecustomer;
    this.dataPayment["typedocument"] = dataForm.typedocument;
    this.dataPayment["numberdocument"] = dataForm.numberdocument;
    this.dataPayment["id_customer"] = userData.id;
    this.dataPayment["id_cart"] = cart.id;
    this.dataPayment["payment"] = 'PSE';

    let dataPayment = JSON.stringify( this.dataPayment );
    return new Promise((resolve, reject) => {
      this.http.post(this._url, dataPayment)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

}