import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class NetworkService {

  private _url: string = WS_BASE+'getNetwork';
  public userData: any = {};
  public data:any = {};
    
  constructor(public http: Http) {}

  public getDataAccount(id_customer, option, limit, last_total, obj_inv='') {
    this._url = WS_BASE+'getNetwork';
    let params = new URLSearchParams();
      params.set('id_customer', id_customer);
      params.set('option', option);
      params.set('limit', limit);
      params.set('last_total', last_total);
      params.set('obj_inv', obj_inv);
      // No tiene los datos todavía
      return new Promise(resolve => {
        // Estamos utilizando el proveedor Angular HTTP para solicitar los datos,
        // Luego en la respuesta, mapeará los datos JSON a un objeto JS analizado.
        // A continuación, procesamos los datos y resolvemos la promesa con los nuevos datos.
        this.http.get(this._url, { search: params })
          .map(res => res.json())
          .subscribe(
            data => {
              this.userData = JSON.stringify(data.result);
              resolve( this.userData );
            },
            (err:Response) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
  
  public sendMessage(id_customer_send, id_customer_receive, message) {
    this._url = WS_BASE+'sendMessage';
    let params = new URLSearchParams();
      params.set('id_customer_send', id_customer_send);
      params.set('id_customer_receive', id_customer_receive);
      params.set('message', message);
      return new Promise(resolve => {
        this.http.get(this._url, { search: params })
          .map(res => res.json())
          .subscribe(
            data => {
              this.userData = JSON.stringify(data.result);
              resolve( this.userData );
            },
            (err:Response) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
  
  public sendInvitation(id_customer:any, formData:any, phoneWhatsapp:any) {
    this._url = WS_BASE+'sendInvitation';
    let params = new URLSearchParams();
      params.set('id_customer', id_customer);
      params.set('email', formData.email);
      params.set('firtsname', formData.firtsname);
      params.set('lastname', formData.lastname);
      params.set('whatsapp', formData.whatsapp);
      params.set('phone', phoneWhatsapp);
      return new Promise(resolve => {
        this.http.get(this._url, { search: params })
          .map(res => res.json())
          .subscribe(
            data => {
              this.userData = JSON.stringify(data.result);
              resolve( this.userData );
            },
            (err:Response) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
  
  public findInvitation(id_customer:any) {
    this._url = WS_BASE+'findInvitation';
    let params = new URLSearchParams();
      params.set('id_customer', id_customer);
      return new Promise(resolve => {
        this.http.get(this._url, { search: params })
          .map(res => res.json())
          .subscribe(
            data => {
              this.userData = JSON.stringify(data.result);
              resolve( this.userData );
            },
            (err:Response) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
  
  public getNetworkGUser(id_customer:string) {
    this._url = WS_BASE+'getNetworkGUser';
    let params = new URLSearchParams();
      params.set('id_customer', id_customer);
    return new Promise(resolve => {
      this.http.get(this._url, { search: params })
        .map(res => res.json())
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err:Response) => {
            this.data = '{"Error": "Error al traer la red del Gráfico"}';
            resolve(this.data);
          }
        );
    });
  }
  
  
}
