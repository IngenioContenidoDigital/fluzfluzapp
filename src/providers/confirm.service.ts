import { Injectable } from '@angular/core';
import { WS_BASE } from './config';
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';

@Injectable()
export class ConfirmService {
  public data:any;
  constructor(private http: HttpClient) { }

  confirm(confirmPhoneData:any) {
    return new Promise((resolve, reject) => {
      this.http.post(WS_BASE+'confirm', JSON.stringify(confirmPhoneData))
      .subscribe((res:any) => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
  
  public getPhone(id_customer:number) {
    return new Promise(resolve => {
      let params = new HttpParams().set('id_customer', ""+id_customer);
      this.http.get(WS_BASE+'/getPhoneByIdCustomer',  { params: params }).subscribe((data:any) => {
        this.data = data.result;
        resolve(this.data);
      }, err => {
        this.data = '{"Error": "Error al obtener el estado del telefono."}';
        console.log(err);
      });
    });
  }
  
  public setPhone(id_customer:any, phone:any) {
    return new Promise(resolve => {
      let Params = new HttpParams();
      Params = Params.append('id_customer', id_customer);
      Params = Params.append('phone', phone);
      this.http.get(WS_BASE+'setPhoneByIdCustomer', { params: Params }).subscribe((data:any) => {
        this.data = data;
        resolve(this.data);
      }, err => {
        this.data = '{"Error": "Error al guardar el telefono."}';
        console.log(err);
      });
    });
  }
  
  public sendSMS(id_customer:any) {
    return new Promise(resolve => {
      let params = new HttpParams().set('id_customer', ""+id_customer);
      this.http.get(WS_BASE+'sendSMSConfirm', { params: params }).subscribe((data:any) => {
        this.data = JSON.stringify(data.result);
        resolve(this.data);
      }, err => {
        this.data = '{"Error": "Error al intentar enviar el sms."}';
        console.log(err);
      });
    });
  }
  
  public sendSMSRandom(phone:any) {
    return new Promise(resolve => {
      let params = new HttpParams().set('phone', ""+phone);
      this.http.get(WS_BASE+'sendSMSConfirmRandom', { params: params }).subscribe((data:any) => {
        this.data = data.result;
        resolve(this.data);
      }, err => {
        this.data = '{"Error": "Error al intentar enviar el sms."}';
        console.log(err);
      });
    });
  }
  
  public getRequestSMS(){
    return new Promise(resolve => {
      this.http.get(WS_BASE+'getRequestSMS').subscribe((data:any) => {
        this.data = data.result;
        resolve(this.data);
      }, err => {
        console.log(err);
      });
    });
  }
  
}
