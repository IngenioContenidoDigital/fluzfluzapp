import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class SearchService {
  
  private _url: string = WS_BASE + '/search';
  public data: any;

  constructor(public http: HttpClient) {}
  
  public search( q:string, option:any, limit:any = 0, lastTotal:any = 0 ) {
    let params = new HttpParams();
    params.set('param', q);
    params.set('option', option);
    params.set('limit', limit);
    params.set('lastTotal', lastTotal);
    
    return new Promise(resolve => {
      // Estamos utilizando el proveedor Angular HTTP para solicitar los datos,
      // Luego en la respuesta, mapeará los datos JSON a un objeto JS analizado.
      // A continuación, procesamos los datos y resolvemos la promesa con los nuevos datos.
      this.http.get(this._url, { params: params })
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err) => {
            this.data = '{"Error": "Error al traer las tiendas"}';
            resolve(this.data);
          }
        );
    });
  }
  
  public searchByMap( lat:any, lng:any ) {
    let params = new HttpParams();
    params.set('lat', lat);
    params.set('lng', lng);
    let url = WS_BASE + '/searchByMap';
    return new Promise(resolve => {
      this.http.get(url, { params: params })
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err) => {
            this.data = '{"Error": "Error al traer las tiendas"}';
            resolve(this.data);
          }
        );
    });
  }
  
  
}