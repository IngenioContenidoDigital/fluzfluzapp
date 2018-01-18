import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';

@Injectable()
export class CartService {
  
  private _url: string = WS_BASE + 'cart';
  public data: any;

  constructor(public http: HttpClient) {}
  
  // AddToCart   option = 1 
  // UpdateCart  option = 2 
  // DeleteCart  option = 3
  // GetCart     option = 4
  
  public addToCart( idCart, idProduct, id_customer ) {
    let params = JSON.stringify({
      id_customer: id_customer,
      idCart: idCart,
      idProduct: idProduct,
      option: 1
    });
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return new Promise((resolve, reject) => {
      this.http.post(this._url, {
        headers: headers,
        params: params,
      })
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
  
  public updateCart( cart, id_customer ){
    let params = JSON.stringify({
      id_customer: id_customer,
      cart: cart,
      option: 2
    });
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return new Promise((resolve, reject) => {
      this.http.post(this._url, {
        headers: headers,
        params: params,
      })
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  public setPhonesRecharged( id_cart, phones, id_customer ) {
    let _url = WS_BASE+'setPhonesRecharged';
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' }) ;
    let params = JSON.stringify({
      id_customer: id_customer,
      id_cart: id_cart,
      phones: phones
    });
    
    return new Promise((resolve, reject) => {
      this.http.post(_url, {
        headers: headers,
        params: params,
      })
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
}