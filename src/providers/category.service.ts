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
      let Params = new HttpParams();
      Params = Params.append('option', option);
      Params = Params.append('id_category', id_category);
      Params = Params.append('limit', limit);
      
      this.http.get(this._url, { params: Params })
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
  
  public getNameOneCategoryById(id_category){
    return new Promise(resolve => {
      let Params = new HttpParams().set('id_category', ""+id_category);
      this.http.get(WS_BASE+'getNameOneCategoryById', { params: Params })
        .subscribe(
        	(data:any) => {
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