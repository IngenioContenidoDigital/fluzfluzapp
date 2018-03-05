import { Injectable } from '@angular/core';
//import { Http, URLSearchParams, Response } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class VaultService {
  
  private _url: string = WS_BASE + '/getVaultData';
  public data: any;

  constructor(public http: HttpClient) {}
  
  public getVaultData(id_customer:any, id_manufacturer:any | null) {
    return new Promise(resolve => {
      let Params = new HttpParams();
      Params = Params.append('id_customer', id_customer);
      Params = Params.append('id_manufacturer', id_manufacturer);
      // Estamos utilizando el proveedor Angular HTTP para solicitar los datos,
      // Luego en la respuesta, mapeará los datos JSON a un objeto JS analizado.
      // A continuación, procesamos los datos y resolvemos la promesa con los nuevos datos.
      this.http.get(this._url, { params: Params })
        .subscribe(
        	(data:any) => {
            this.data = data;
            resolve(this.data);
          }
        );
    });
  }
  
  public getOrderHistory(id_customer:any) {
    return new Promise(resolve => {
      let url = WS_BASE + '/getOrderHistory';
      let Params = new HttpParams().set('id_customer', id_customer);
      
      this.http.get(url, { params: Params })
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err) => {
            this.data = '{"Error": "Error al traer el historial de ordenes"}';
            resolve(this.data);
          }
        );
    });
  }
  
  public getOrderDetail(id_order:any) {
    return new Promise(resolve => {
      let url = WS_BASE + '/getOrderDetail';
      let Params = new HttpParams().set('id_order', id_order);
      
      this.http.get(url, { params: Params })
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err) => {
            this.data = '{"Error": "Error al traer el historial de ordenes"}';
            resolve(this.data);
          }
        );
    });
  }
  
  public getStateManufacturer(id_manufacturer:any) {
    return new Promise(resolve => {
      let url = WS_BASE + '/getStateManufacturer';
      let Params = new HttpParams().set('id_manufacturer', id_manufacturer);
      
      this.http.get(url, { params: Params })
        .subscribe(
        	data => {
            this.data = data;
            resolve(this.data);
          },
          (err) => {
            this.data = '{"Error": "Error al traer el historial de ordenes"}';
            resolve(this.data);
          }
        );
    });
  }
}