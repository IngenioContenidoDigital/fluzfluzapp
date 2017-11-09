import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { WS_BASE } from './config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class BancoService {
    private _url: string = WS_BASE+'bankPse';
    public headers = new Headers({ 'Content-Type': 'application/json' });
    
    constructor(public http: Http) {}
    
    public getBanks() {
      return this.http.post(this._url, '', this.headers)
        .map(this.extractData)
        .catch(this.handleError);
    }
    
    private extractData(res: Response) {
        return res || { };
    }
  
    private handleError (error: Response | any) {
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