import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';

@Injectable()
export class PersonalInformationService {
  public headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  public data = {};

  constructor(public http: HttpClient) {}

  public getPhoneProviders() {
    let _url = WS_BASE+'phoneProviders';
    return new Promise((resolve, reject) => {
      this.http.post(_url, '')
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
    
  public getCities() {
    let _url = WS_BASE+'cities';
    return new Promise((resolve, reject) => {
      this.http.post(_url, '')
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
    
  public getPhonesCustomer(id_customer) {
    let _url = WS_BASE+'getPhonesCustomer';
    this.data["id_customer"] = id_customer;
    let data = JSON.stringify( this.data );
    return new Promise((resolve, reject) => {
      this.http.post(_url, data)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
    
  public addPhone(id_customer, phone) {
    let _url = WS_BASE+'addPhoneCustomer';
    this.data["id_customer"] = id_customer;
    this.data["phone"] = phone;
    let data = JSON.stringify( this.data );
    return new Promise((resolve, reject) => {
      this.http.post(_url, data)
      .subscribe(res => {
        console.log("addPhone");
        console.log(res);
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }

  public getPersonalInformation(id_customer) {
    let _url = WS_BASE+'personalInformation';
    this.data["id_customer"] = id_customer;
    let data = JSON.stringify( this.data );
    return new Promise((resolve, reject) => {
      this.http.post(_url, data)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
    
  public save(id_customer, dataForm) {
    let _url = WS_BASE+'savePersonalInformation';
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
    return new Promise((resolve, reject) => {
      this.http.post(_url,data)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
    
  public getSevedCreditCard(id_customer) {
    let _url = WS_BASE+'sevedCreditCard';
    this.data["id_customer"] = id_customer;
    let data = JSON.stringify( this.data );
    return new Promise((resolve, reject) => {
      this.http.post(_url, data)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });    
  }
}