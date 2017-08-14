import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { WS_BASE } from './config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';

@Injectable()
export class LoginService {
  
  public response:any;
  public data:any;

  constructor(private http: Http) { }

  postLogin(variables): Observable<any> {
    let bodyString = JSON.stringify(variables);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(WS_BASE+'login', bodyString, headers)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public register(value) {
    let bodyString = JSON.stringify(value);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(WS_BASE+'createCustomer', bodyString, headers)
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
  
  public logout() {
    // No tiene los datos todavía
    return new Promise(resolve => {
      // Estamos utilizando el proveedor Angular HTTP para solicitar los datos,
      // Luego en la respuesta, mapeará los datos JSON a un objeto JS analizado.
      // A continuación, procesamos los datos y resolvemos la promesa con los nuevos datos.
      this.http.get(WS_BASE+'logout')
        .map(res => res.json())
        .subscribe(
          data => {
            resolve( data );
          },
          (err:Response) => {
            this.response  = err.json();
            resolve(this.response );
          }
        );
    });
  }
  
  
}

