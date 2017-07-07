import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class CategoryService {
  
  private _url: string = WS_BASE + '/getCategory';
  public data: any;

  constructor(public http: Http) {}
  
  public getCategory( option:any, id_category:any = 0, limit:any = 0 ) {
    return new Promise(resolve => {
      let params = new URLSearchParams();
      params.set('option', option);
      //console.log("Manda esta opcion desde el servicio: ", option );
      params.set('id_category', id_category);
      params.set('limit', limit);
      
      this.http.get(this._url, { search: params })
        .map(res => res.json())
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err:Response) => {
            this.data = '{"Error": "Error al traer las categorias."}';
            resolve(this.data);
          }
        );
    });
  }
}