import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class NetworkService {

  private _url: string = WS_BASE+'getNetwork';
  public userData: any = {};
  public data:any = {};
    
  constructor(public http: HttpClient) {}

  public getDataAccount(id_customer, option, limit, last_total, obj_inv='') {
    this._url = WS_BASE+'getNetwork';
    let Params = new HttpParams();
    Params = Params.append('id_customer', id_customer);
    Params = Params.append('option', option);
    Params = Params.append('limit', limit);
    Params = Params.append('last_total', last_total);
    Params = Params.append('obj_inv', obj_inv);
    // No tiene los datos todavía
    return new Promise(resolve => {
      // Estamos utilizando el proveedor Angular HTTP para solicitar los datos,
      // Luego en la respuesta, mapeará los datos JSON a un objeto JS analizado.
      // A continuación, procesamos los datos y resolvemos la promesa con los nuevos datos.
      this.http.get(this._url, { params: Params })
        .subscribe(
          (data:any) => {
            this.userData = JSON.stringify(data.result);
            resolve( this.userData );
          },
          (err) => {
            this.userData  = err.json();
            resolve(this.userData );
          }
        );
    });
  }
  
  public sendMessage(id_customer_send, id_customer_receive, message) {
    this._url = WS_BASE+'sendMessage';
    let Params = new HttpParams();
    Params = Params.append('id_customer_send', id_customer_send);
    Params = Params.append('id_customer_receive', id_customer_receive);
    Params = Params.append('message', message);
    return new Promise(resolve => {
      this.http.get(this._url, { params: Params })
        .subscribe(
          (data:any) => {
            this.userData = JSON.stringify(data.result);
            resolve( this.userData );
          },
          (err) => {
            this.userData  = err.json();
            resolve(this.userData );
          }
        );
    });
  }
  
  public sendInvitation(id_customer:any, formData:any, phoneWhatsapp:any) {
    this._url = WS_BASE+'sendInvitation';
    let Params = new HttpParams();
    Params = Params.append('id_customer', id_customer);
    Params = Params.append('email', formData.email);
    Params = Params.append('firtsname', formData.firtsname);
    Params = Params.append('lastname', formData.lastname);
    Params = Params.append('whatsapp', formData.whatsapp);
    Params = Params.append('phone', phoneWhatsapp);
    return new Promise(resolve => {
      this.http.get(this._url, { params: Params })
        .subscribe(
          (data:any) => {
            this.userData = JSON.stringify(data.result);
            resolve( this.userData );
          },
          (err) => {
            this.userData  = err.json();
            resolve(this.userData );
          }
        );
    });
  }
  
  public findInvitation(id_customer:any) {
    this._url = WS_BASE+'findInvitation';
    let Params = new HttpParams().set('id_customer', id_customer);
    return new Promise(resolve => {
      this.http.get(this._url, { params: Params })
        .subscribe(
          (data:any) => {
            this.userData = JSON.stringify(data.result);
            resolve( this.userData );
          },
          (err) => {
            this.userData  = err.json();
            resolve(this.userData );
          }
        );
    });
  }
  
  public getNetworkGUser(id_customer:string) {
    this._url = WS_BASE+'getNetworkGUser';
    let Params = new HttpParams().set('id_customer', id_customer);
    return new Promise(resolve => {
      this.http.get(this._url, { params: Params })
        .subscribe(
          (data:any) => {
            this.data = data;
            resolve(this.data);
          },
          (err) => {
            this.data = '{"Error": "Error al traer la red del Gráfico"}';
            resolve(this.data);
          }
        );
    });
  }
  
  
}
