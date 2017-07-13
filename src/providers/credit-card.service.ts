import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { WS_BASE } from './config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class CreditCardService {

    private _url: string = WS_BASE+'pay';
    public headers = new Headers({ 'Content-Type': 'application/json' });
    public responsePayment: any;
    public dataPayment = {};
    
    constructor(public http: Http) {}

    public sendPayment(dataForm, userData, cart) {
        
        this.dataPayment["namecard"] = dataForm.namecard;
        this.dataPayment["numbercard"] = dataForm.numbercard;
        this.dataPayment["datecard"] = dataForm.datecard;
        this.dataPayment["codecard"] = dataForm.codecard;
        this.dataPayment["id_customer"] = userData.id;
        this.dataPayment["id_cart"] = cart.id;
        this.dataPayment["payment"] = 'Tarjeta_credito';
        
        let dataPayment = JSON.stringify( this.dataPayment );

        return this.http.post(this._url, dataPayment, this.headers)
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