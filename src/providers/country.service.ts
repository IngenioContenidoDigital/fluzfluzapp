import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { URL_BASE_COUNTRY_CODE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class CountryService {

  private _url: string = URL_BASE_COUNTRY_CODE+'/all';
  public userData: any = {};
    
  constructor(public http: Http) {}

  public getCountries() {
    let params = new URLSearchParams();
      params.set('fields', 'name;callingCodes;flag');
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
}