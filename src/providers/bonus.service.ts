import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class BonusService {

  private _url: string = WS_BASE+'updateBonus';
  public data: any = {};
    
  constructor(public http: Http) {}

  public updateBonus( card:any, used:any, price_card_used:any = 0) {
    let params = new URLSearchParams();
      params.set('card', card);
      params.set('used', used);
      params.set('price_card_used', price_card_used);
      return new Promise(resolve => {
        this.http.get(this._url, { search: params })
          .map(res => res.json())
          .subscribe(
            data => {
              this.data = JSON.stringify(data.result);
              resolve( this.data );
            },
            (err:Response) => {
              this.data  = err.json();
              resolve( this.data );
            }
          );
      });
  }
  
  public sendGift( id_customer:any, id_customer_receive:any, code:any, id_product_code:any, message:any, customer_send:any) {
    let url = WS_BASE + '/sendGiftCard';
    let params = new URLSearchParams();
    params.set('id_customer', id_customer);
    params.set('id_customer_receive', id_customer_receive);
    params.set('code', code);
    params.set('id_product_code', id_product_code);
    params.set('message', message);
    params.set('customer_send', customer_send);
    return new Promise(resolve => {
      this.http.get(url, { search: params })
        .map(res => res.json())
        .subscribe(
          data => {
            this.data = data;
            resolve( this.data );
          },
          (err:Response) => {
            this.data  = err.json();
            resolve( this.data );
          }
        );
    });
  }
  
  public getAddressManufacturer(manufacturer:any){
    let url = WS_BASE + '/getAddressManufacturer';
    let params = new URLSearchParams();
      params.set('id_manufacturer', manufacturer);
    return new Promise(resolve => {
      this.http.get(url, { search: params })
        .map(res => res.json())
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err:Response) => {
            this.data = '{"Error": "Error al traer los banners"}';
            resolve(this.data);
          }
        );
    });
  }
  
  public getMapData(latitude:any, longitude:any, manufacturer:any, option:any){
    let url = WS_BASE + '/getAddressMaps';
    let params = new URLSearchParams();
      params.set('latitude', latitude);
      params.set('longitude', longitude);
      params.set('id_manufacturer', manufacturer);
      params.set('option', option);
    return new Promise(resolve => {
      this.http.get(url, { search: params })
        .map(res => res.json())
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err:Response) => {
            this.data = '{"Error": "Error al traer los banners"}';
            resolve(this.data);
          }
        );
    });
  }
}
