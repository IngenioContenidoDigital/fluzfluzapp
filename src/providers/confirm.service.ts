import { Injectable } from '@angular/core';
import { WS_BASE } from './config';
import { HttpClient, HttpParams } from "@angular/common/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';

@Injectable()
export class ConfirmService {
  public data:any;
  constructor(private http: HttpClient) { }

  confirm(variables) {
    let confirmNumber = JSON.stringify(variables);
    return new Promise((resolve, reject) => {
      this.http.post(WS_BASE+'confirm', {
        params: confirmNumber,
      })
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
  
  public getPhone(id_customer:any) {
    let params = new HttpParams();
    params.set('id_customer', id_customer);
    return new Promise(resolve => {
      this.http.get(WS_BASE+'logout', { params: params }).subscribe((data:any) => {
        this.data = data.result;
        resolve(data);
      }, err => {
        this.data = '{"Error": "Error al obtener el estado del telefono."}';
        console.log(err);
      });
    });
  }
  
  public setPhone(id_customer:any, phone:any) {
    return new Promise(resolve => {
      let params = new HttpParams();
      params.set('id_customer', id_customer);
      params.set('phone', phone);
      this.http.get(WS_BASE+'setPhoneByIdCustomer', { params: params }).subscribe((data:any) => {
        this.data = data.result;
        resolve(data);
      }, err => {
        this.data = '{"Error": "Error al guardar el telefono."}';
        console.log(err);
      });
    });
  }
  
  public sendSMS(id_customer:any) {
    return new Promise(resolve => {
      let params = new HttpParams();
      params.set('id_customer', id_customer);
      this.http.get(WS_BASE+'sendSMSConfirm', { params: params }).subscribe((data:any) => {
        this.data = data.result;
        resolve(data);
      }, err => {
        this.data = '{"Error": "Error al intentar enviar el sms."}';
        console.log(err);
      });
    });
  }
  
}
