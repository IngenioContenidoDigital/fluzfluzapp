import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';

@Injectable()
export class LoginService {
  
  public response:any;
  public data:any;

  constructor(private http: HttpClient) { }

  postLogin(variables:any) {
    return new Promise((resolve, reject) => {
      this.http.post(WS_BASE + '/login', JSON.stringify(variables))
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
    
  }

  public register(value:any) {
    let bodyString = JSON.stringify(value);
    console.log(value);
    return new Promise((resolve, reject) => {
      this.http.post(WS_BASE+'createCustomer', bodyString)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
  
  public logout() {
    // No tiene los datos todavía
    return new Promise(resolve => {
      this.http.get(WS_BASE+'logout').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  
  getEmailSocialMedia(email:any){
    let url = WS_BASE+'/getEmailSocialMedia';
    let params = new HttpParams().set('email', email);
    return new Promise(resolve => {
      this.http.get(url, { params: params }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  
  setTokenFCM(id_customer:any, token:any){
    let url = WS_BASE+'/setTokenFCM';
    let Params = new HttpParams();
    Params = Params.append('id_customer', id_customer);
    Params = Params.append('token', token);
    return new Promise(resolve => {
      this.http.get(url, { params: Params }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
    
}

