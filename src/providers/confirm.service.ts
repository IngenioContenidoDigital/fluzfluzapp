import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { WS_BASE } from './config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';

@Injectable()
export class ConfirmService {
  public data:any;
  constructor(private http: Http) { }

  confirm(variables): Observable<any> {
    let confirmNumber = JSON.stringify(variables);
    return this.http.post(WS_BASE+'confirm', confirmNumber)
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
  
  public getPhone(id_customer:any) {
    return new Promise(resolve => {
      let params = new URLSearchParams();
      params.set('id_customer', id_customer);
      this.http.get(WS_BASE+'getPhoneByIdCustomer', { search: params })
        .map(res => res.json())
        .subscribe(
        	data => {
            this.data = data.result;
            resolve(this.data);
          },
          (err:Response) => {
            this.data = '{"Error": "Error al obtener el estado del telefono."}';
            resolve(this.data);
          }
        );
    });
  }
}
