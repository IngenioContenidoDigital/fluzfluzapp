import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { WS_BASE } from './config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class CartService {
  
  private _url: string = WS_BASE + 'cart';
  public data: any;

  constructor(public http: Http) {}
  
  // AddToCart   option = 1 
  // UpdateCart  option = 2 
  // DeleteCart  option = 3
  // GetCart     option = 4
  
  public addToCart( idCart, idProduct ): Observable<any> {
    let params = JSON.stringify({
      idCart: idCart,
      idProduct: idProduct,
      option: 1
    });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(this._url, params, headers)
      .map(this.extractData)
      .catch(this.handleError);
  }
  
  public updateCart( cart ): Observable<any> {
    let params = JSON.stringify({
      cart: cart,
      option: 2
    });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(this._url, params, headers)
      .map(this.extractData)
      .catch(this.handleError);
  }
    
  private extractData(res: Response) {
    return res || { };
  }
  
  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}