import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class TransferFluzService {
  public headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  public dataSearch = {};
  public dataTransfer = {};

  constructor(public http: HttpClient) {}

  public searchFluzzers(searchBox, userId) {
    this.dataSearch["searchBox"] = searchBox;
    this.dataSearch["userId"] = userId;
    let dataSearch = JSON.stringify( this.dataSearch );
    let _url = WS_BASE+'searchFluzzer';
    return new Promise((resolve, reject) => {
      this.http.post(_url, {
        headers: this.headers,
        params: dataSearch,
      })
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
  
  public transferFluz(user,fluzzer,points) {
    this.dataTransfer["user"] = user;
    this.dataTransfer["fluzzer"] = fluzzer;
    this.dataTransfer["points"] = points;

    let dataTransfer = JSON.stringify( this.dataTransfer );
    let _url = WS_BASE+'transferFluz';
    
    return new Promise((resolve, reject) => {
      this.http.post(_url, {
        headers: this.headers,
        params: dataTransfer,
      })
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
}
