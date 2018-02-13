import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { WS_BASE } from './config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class SupportService {

  public data:any = {};
  public bodyString:any = {};
    
  constructor(public http: Http) {}

  public sendProblem(id_customer, name, email, value) {
    
    this.bodyString["id_customer"] = id_customer;
    this.bodyString["name"] = name;
    this.bodyString["email"] = email;
    this.bodyString["issue"] = value.issue;
    this.bodyString["problem"] = value.problem;
    
        
    let bodyString = JSON.stringify(this.bodyString);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    return this.http.post(WS_BASE+'sendSupport', bodyString, headers)
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
