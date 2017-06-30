import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class NetworkService {

  private _url: string = WS_BASE+'getNetwork';
  public userData: any = {};
    
  constructor(public http: Http) {}

  public getDataAccount(id_customer, option, limit, last_total, obj_inv='') {
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
}