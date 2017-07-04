import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { WS_BASE } from './config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class PasscodeService {
  
  private _url: string = WS_BASE + '/getPasscode';
  public data: any;

  constructor(public http: Http) {}
  
  public getPasscode(id_customer:any, id_manufacturer:any = null) {
    return new Promise(resolve => {
      let params = new URLSearchParams();
      params.set('id_customer', id_customer);
      this.http.get(this._url, { search: params })
        .map(res => res.json())
        .subscribe(
        	data => {
            this.data = data.result;
            resolve(this.data);
          },
          (err:Response) => {
            this.data = '{"Error": "Error al obtener el estado de la contraseña."}';
            resolve(this.data);
          }
        );
    });
  }
  
  public setPasscode( id_customer:any,  passcode:any ) {
    return new Promise(resolve => {
      let params = new URLSearchParams();
      params.set('id_customer', id_customer);
      params.set('passcode', passcode);
      this.http.get(WS_BASE + '/setPasscode', { search: params })
        .map(res => res.json())
        .subscribe(
        	data => {
            this.data = JSON.stringify(data.result);
            resolve(this.data);
          },
          (err:Response) => {
            this.data = '{"Error": "Error al guardar la contraseña"}';
            resolve(this.data);
          }
        );
    });
  }
  
  public validatePasscode(variables): Observable<any> {
    let passcodeInfo = JSON.stringify(variables);
      return this.http.post(WS_BASE+'validatePasscode', passcodeInfo)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    return res || { };
  }
  
  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}