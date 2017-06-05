import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class VaultService {
  
  private _url: string = WS_BASE + '/getVaultData';
  public data: any;

  constructor(public http: Http) {}
  
  public getVaultData(id_customer:any, id_manufacturer:any = null) {
    return new Promise(resolve => {
      let params = new URLSearchParams();
      params.set('id_customer', id_customer);
      params.set('id_manufacturer', id_manufacturer);
      // Estamos utilizando el proveedor Angular HTTP para solicitar los datos,
      // Luego en la respuesta, mapeará los datos JSON a un objeto JS analizado.
      // A continuación, procesamos los datos y resolvemos la promesa con los nuevos datos.
      this.http.get(this._url, { search: params })
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