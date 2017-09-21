import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { WS_BASE } from './config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class TransferFluzService {

    public headers = new Headers({ 'Content-Type': 'application/json' });
    public dataSearch = {};
    public dataTransfer = {};
    
    constructor(public http: Http) {}

    public searchFluzzers(searchBox, userId) {
        
        this.dataSearch["searchBox"] = searchBox;
        this.dataSearch["userId"] = userId;
        
        let dataSearch = JSON.stringify( this.dataSearch );
        let _url = WS_BASE+'searchFluzzer';

        return this.http.post(_url, dataSearch, this.headers)
                    .map(this.extractData)
                    .catch(this.handleError);
    }

    public transferFluz(user,fluzzer,points) {
        
        this.dataTransfer["user"] = user;
        this.dataTransfer["fluzzer"] = fluzzer;
        this.dataTransfer["points"] = points;
        
        let dataTransfer = JSON.stringify( this.dataTransfer );
        let _url = WS_BASE+'transferFluz';

        return this.http.post(_url, dataTransfer, this.headers)
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
