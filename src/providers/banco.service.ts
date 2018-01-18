import { Injectable } from '@angular/core';
//import { Headers, Http, Response } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';

@Injectable()
export class BancoService {
    private _url: string = WS_BASE+'bankPse';
    
    constructor(public http: HttpClient) {}
    public getBanks() {
      return new Promise((resolve, reject) => {
        this.http.post(this._url+'/users', JSON.stringify({}), {
          headers: new HttpHeaders().set('Authorization', 'my-auth-token'),
          params: new HttpParams().set('id', '3'),
        })
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    }
}