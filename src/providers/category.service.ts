import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class CategoryService {
  
  private _url: string = WS_BASE + '/getCategory';
  public data: any;

  constructor(public http: HttpClient) {}
  
  public getCategory( option:any, id_category:any = 0, limit:any = 0 ) {
    return new Promise(resolve => {
      let params = new HttpParams();
      params.set('option', option);
      params.set('id_category', id_category);
      params.set('limit', limit);
      
      this.http.get(this._url, { params: params })
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err) => {
            this.data = '{"Error": "Error al traer las categorias."}';
            resolve(this.data);
          }
        );
    });
  }
}