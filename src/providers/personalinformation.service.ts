import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { WS_BASE } from './config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class PersonalInformationService {
    
    public headers = new Headers({ 'Content-Type': 'application/json' });
    public data = {};
    
    constructor(public http: Http) {}
    
    public getPhoneProviders() {
        let _url = WS_BASE+'phoneProviders';
        return this.http.post(_url, '', this.headers)
                    .map(this.extractData)
                    .catch(this.handleError);
    }
    
    public getCities() {
        let _url = WS_BASE+'cities';
        return this.http.post(_url, '', this.headers)
                    .map(this.extractData)
                    .catch(this.handleError);
    }
    
    public getPhonesCustomer(id_customer) {
        let _url = WS_BASE+'getPhonesCustomer';
        
        this.data["id_customer"] = id_customer;
        let data = JSON.stringify( this.data );
        
        return this.http.post(_url, data, this.headers)
                    .map(this.extractData)
                    .catch(this.handleError);
    }

    public addPhone(id_customer, phone) {
        let _url = WS_BASE+'addPhoneCustomer';
        
        this.data["id_customer"] = id_customer;
        this.data["phone"] = phone;
        let data = JSON.stringify( this.data );
        
        return this.http.post(_url, data, this.headers)
                    .map(this.extractData)
                    .catch(this.handleError);
    }
    
    public getPersonalInformation(id_customer) {
        let _url = WS_BASE+'personalinformation';
        
        this.data["id_customer"] = id_customer;
        let data = JSON.stringify( this.data );
        
        return this.http.post(_url, data, this.headers)
                    .map(this.extractData)
                    .catch(this.handleError);
    }
    
    public save(id_customer, dataForm) {
        let _url = WS_BASE+'savepersonalinformation';
        
        this.data["id_customer"] = id_customer;
        this.data["id_gender"] = dataForm.id_gender;
        this.data["password"] = dataForm.password;
        this.data["password_new"] = dataForm.password_new;
        this.data["firstname"] = dataForm.firstname;
        this.data["lastname"] = dataForm.lastname;
        this.data["email"] = dataForm.email;
        this.data["dni"] = dataForm.dni;
        this.data["birthday"] = dataForm.birthday;
        this.data["civil_status"] = dataForm.civil_status;
        this.data["occupation_status"] = dataForm.occupation_status;
        this.data["field_work"] = dataForm.field_work;
        this.data["pet"] = dataForm.pet;
        this.data["pet_name"] = dataForm.pet_name;
        this.data["spouse_name"] = dataForm.spouse_name;
        this.data["children"] = dataForm.children;
        this.data["phone_provider"] = dataForm.phone_provider;
        this.data["phone"] = dataForm.phone;
        this.data["address1"] = dataForm.address1;
        this.data["address2"] = dataForm.address2;
        this.data["city"] = dataForm.city;

        let data = JSON.stringify( this.data );

        return this.http.post(_url, data, this.headers)
                    .map(this.extractData)
                    .catch(this.handleError);
    }
    
    public getSevedCreditCard(id_customer) {
        let _url = WS_BASE+'sevedCreditCard';
        
        this.data["id_customer"] = id_customer;
        let data = JSON.stringify( this.data );
        
        return this.http.post(_url, data, this.headers)
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