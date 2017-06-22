import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class SearchService {
  
  private _url: string = WS_BASE + '/search';
  public data: any;

  constructor(public http: Http) {}
  
  public search( q:string, option:any, limit:any = 0, total_search:any = 0 ) {
    let params = new URLSearchParams();
    params.set('param', q);
    params.set('option', option);
    params.set('limit', limit);
    params.set('total_search', total_search);
    
    return new Promise(resolve => {
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
            this.data = '{"Error": "Error al traer las tiendas"}';
            resolve(this.data);
          }
        );
    });
  }
}