import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class MyAccountService {

  private _url: string = WS_BASE+'myAccountData';
  public userData: any;
    
  constructor(public http: Http) {}

  public getDataAccount(value) {
    let params = new URLSearchParams();
      params.set('userId', value);
      return new Promise(resolve => {
        this.http.get(this._url, { search: params })
          .map(res => res.json())
          .subscribe(
            data => {
              this.userData = JSON.stringify(data);
              resolve( this.userData );
            },
            (err:Response) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
  
  public getProfile(id_customer:any, id_profile:any) {
    let _url = WS_BASE+'getProfile';
    let params = new URLSearchParams();
      params.set('id_customer', id_customer);
      params.set('id_profile', id_profile);
      return new Promise(resolve => {
        this.http.get(_url, { search: params })
          .map(res => res.json())
          .subscribe(
            data => {
              this.userData = JSON.stringify(data.result);
              resolve( this.userData );
            },
            (err:Response) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
  
  public getInviteduserForProfile(id_customer:any) {
    let _url = WS_BASE+'getInviteduserForProfile';
    let params = new URLSearchParams();
      params.set('id_customer', id_customer);
      return new Promise(resolve => {
        this.http.get(_url, { search: params })
          .map(res => res.json())
          .subscribe(
            data => {
              this.userData = JSON.stringify(data);
              resolve( this.userData );
            },
            (err:Response) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
  
  public getActivityNetworkProfile(id_customer:any) {
    let _url = WS_BASE+'getActivityNetworkProfile';
    let params = new URLSearchParams();
      params.set('id_customer', id_customer);
      return new Promise(resolve => {
        this.http.get(_url, { search: params })
          .map(res => res.json())
          .subscribe(
            data => {
              this.userData = JSON.stringify(data);
              resolve( this.userData );
            },
            (err:Response) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
}