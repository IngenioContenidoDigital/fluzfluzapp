import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class MyAccountService {

  private _url: string = WS_BASE+'myAccountData';
  public userData: any;
    
  constructor(public http: HttpClient) {}

  public getDataAccount(value) {
    let params = new HttpParams().set('userId', value);
    return new Promise(resolve => {
      this.http.get(this._url, { params: params })
        .subscribe(
          data => {
            this.userData = JSON.stringify(data);
            resolve( this.userData );
          },
          (err) => {
            this.userData  = err.json();
            resolve(this.userData );
          }
        );
    });
  }
  
  public getProfile(id_customer:any, id_profile:any) {
    let _url = WS_BASE+'getProfile';
    let Params = new HttpParams();
    Params = Params.append('id_customer', id_customer);
    Params = Params.append('id_profile', id_profile);
    return new Promise(resolve => {
      this.http.get(_url, { params: Params })
        .subscribe(
          (data:any) => {
            this.userData = JSON.stringify(data.result);
            resolve( this.userData );
          },
          (err) => {
            this.userData  = err.json();
            resolve(this.userData );
          }
        );
    });
  }
  
  public getInviteduserForProfile(id_customer:any) {
    let _url = WS_BASE+'getInviteduserForProfile';
    let params = new HttpParams().set('id_customer', id_customer);
    return new Promise(resolve => {
      this.http.get(_url, { params: params })
        .subscribe(
          data => {
            this.userData = JSON.stringify(data);
            resolve( this.userData );
          },
          (err) => {
            this.userData  = err.json();
            resolve(this.userData );
          }
        );
    });
  }
  
  public getActivityNetworkProfile(id_customer:any, id_customer_consult:any) {
    let _url = WS_BASE+'getActivityNetworkProfile';
    let Params = new HttpParams();
    Params = Params.append('id_customer', id_customer);
    Params = Params.append('id_customer_consult', id_customer_consult);
    return new Promise(resolve => {
      this.http.get(_url, { params: Params })
        .subscribe(
          data => {
            this.userData = JSON.stringify(data);
            resolve( this.userData );
          },
          (err) => {
            this.userData  = err.json();
            resolve(this.userData );
          }
        );
    });
  }
  
  reactivateAccount(id_customer) {
    let _url = WS_BASE+'reactiveAccount';
    let params = new HttpParams().set('id_customer', id_customer);
    return new Promise(resolve => {
      this.http.get(_url, { params: params })
        .subscribe(
          data => {
            this.userData = data;
            resolve( this.userData );
          },
          (err) => {
            this.userData  = err.json();
            resolve(this.userData );
          }
        );
    });
  }
}