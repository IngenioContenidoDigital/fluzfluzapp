import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { WS_BASE } from './config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class PaymentFluzService {

    private _url: string = WS_BASE+'cart';
    public headers = new Headers({ 'Content-Type': 'application/json' });
    public responsePayment: any;
    public dataApplyPoints = {};
    public dataPayment = {};
    
    constructor(public http: Http) {}

    public applyPoints(user,cart,points) {
        
        this.dataApplyPoints["option"] = 3;
        this.dataApplyPoints["idCustomer"] = user;
        this.dataApplyPoints["cart"] = cart;
        this.dataApplyPoints["points"] = points;
        
        let dataApplyPoints = JSON.stringify( this.dataApplyPoints );

        return this.http.post(this._url, dataApplyPoints, this.headers)
                    .map(this.extractData)
                    .catch(this.handleError);
    }
    
    public sendPayment(userData,cart) {

        this.dataPayment["id_customer"] = userData.id;
        this.dataPayment["id_cart"] = cart.id;
        
        let dataPayment = JSON.stringify( this.dataPayment );
        let url = WS_BASE+'payFreeOrder';

        return this.http.post(url, dataPayment, this.headers)
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