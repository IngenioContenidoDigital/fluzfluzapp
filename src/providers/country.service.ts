import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { URL_BASE_COUNTRY_CODE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class CountryService {

  private _url: string = URL_BASE_COUNTRY_CODE+'/all';
  public userData: any = {};
    
  constructor(public http: HttpClient) {}

  public getCountries() {
    let params = new HttpParams().set('fields', 'name;callingCodes;flag');
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
}