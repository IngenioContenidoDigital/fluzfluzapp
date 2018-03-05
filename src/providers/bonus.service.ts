import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class BonusService {

  private _url: string = WS_BASE+'updateBonus';
  public data: any = {};
    
  constructor(public http: HttpClient) {}

  public updateBonus( card:any, used:any, price_card_used:any = 0) {
    
    let Params = new HttpParams();
    Params = Params.append('card', card);
    Params = Params.append('used', used);
    Params = Params.append('price_card_used', price_card_used);
    return new Promise(resolve => {
      this.http.get(this._url, { params: Params })
        .subscribe(
          (data:any) => {
            this.data = JSON.stringify(data.result);
            resolve( this.data );
          },
          (err) => {
            this.data  = err.json();
            resolve( this.data );
          }
        );
      }
    );
  }
  
  public sendGift( id_customer:any, id_customer_receive:any, code:any, id_product_code:any, message:any, customer_send:any) {
    let url = WS_BASE + '/sendGiftCard';
    let Params = new HttpParams();
    Params = Params.append('id_customer', id_customer);
    Params = Params.append('id_customer_receive', id_customer_receive);
    Params = Params.append('code', code);
    Params = Params.append('id_product_code', id_product_code);
    Params = Params.append('message', message);
    Params = Params.append('customer_send', customer_send);
    return new Promise(resolve => {
      this.http.get(url, { params: Params })
        .subscribe(
          data => {
            this.data = data;
            resolve( this.data );
          },
          (err) => {
            this.data  = err.json();
            resolve( this.data );
          }
        );
    });
  }
  
  public getAddressManufacturer(manufacturer:any){
    let url = WS_BASE + '/getAddressManufacturer';
    let Params = new HttpParams();
    Params = Params.append('id_manufacturer', manufacturer);
    return new Promise(resolve => {
      this.http.get(url, { params: Params })
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err) => {
            this.data = '{"Error": "Error al traer los banners"}';
            resolve(this.data);
          }
        );
    });
  }
  
  public getMapData(latitude:any, longitude:any, manufacturer:any, option:any){
    let url = WS_BASE + '/getAddressMaps';
    let Params = new HttpParams();
    Params = Params.append('latitude', latitude);
    Params = Params.append('longitude', longitude);
    Params = Params.append('id_manufacturer', manufacturer);
    Params = Params.append('option', option);
    return new Promise(resolve => {
      this.http.get(url, { params: Params })
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err) => {
            this.data = '{"Error": "Error al traer los banners"}';
            resolve(this.data);
          }
        );
    });
  }
}
