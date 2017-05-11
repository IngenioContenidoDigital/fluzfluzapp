import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class MyAccountService {

  private _url: string = WS_BASE+'myAccountData';
  public userData: any;
    
  constructor(public http: Http) {}

  public getDataAccount(value) {
//    console.log("\n\nEntro a getDataAccount:\nEste es el value:");
//    console.log(value);
//    let idCustomer = value;
//    return this.http.get(this._url, idCustomer)
//    .map(this.extractData);
    let params = new URLSearchParams();
      params.set('userId', value);

      // No tiene los datos todavía
      return new Promise(resolve => {
        // Estamos utilizando el proveedor Angular HTTP para solicitar los datos,
        // Luego en la respuesta, mapeará los datos JSON a un objeto JS analizado.
        // A continuación, procesamos los datos y resolvemos la promesa con los nuevos datos.
        this.http.get(this._url, { search: params })
          .map(res => res.json())
          .subscribe(
            data => {
              console.log(JSON.stringify(data));
              this.userData = JSON.stringify(data);
              resolve( this.userData );
            },
            (err:Response) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
//
//  private extractData(res: Response) {
//    return res || { };
//  }
  
  
  

}