import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';


@Injectable()
export class SupportService {

  public data:any = {};
  public bodyString:any = {};
    
  constructor(public http: HttpClient) {}

  public sendProblem(id_customer, name, email, value) {
    
    this.bodyString["id_customer"] = id_customer;
    this.bodyString["name"] = name;
    this.bodyString["email"] = email;
    this.bodyString["issue"] = value.issue;
    this.bodyString["problem"] = value.problem;
    
    let bodyString = JSON.stringify(this.bodyString);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return new Promise((resolve, reject) => {
      this.http.post(WS_BASE+'sendSupport', {
        headers: headers,
        params: bodyString,
      })
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
}
