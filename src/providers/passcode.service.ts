import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class PasscodeService {
  
  private _url: string = WS_BASE + '/getPasscode';
  public data: any;

  constructor(public http: HttpClient) {}
  
  public getPasscode(id_customer:any) {
    return new Promise(resolve => {
      let Params = new HttpParams().set('id_customer', id_customer);
      this.http.get(this._url, { params: Params }).subscribe((data:any) => {
        this.data = data.result;
        resolve(data);
      }, err => {
        this.data = '{"Error": "Error al obtener el estado de la contraseña."}';
        console.log(err);
      });
    });
  }
  
  public setPasscode( id_customer:any,  passcode:any ) {
    return new Promise(resolve => {
      let Params = new HttpParams();
      Params = Params.append('id_customer', id_customer);
      Params = Params.append('passcode', passcode);
      this.http.get(WS_BASE + '/setPasscode', { params: Params }).subscribe((data:any) => {
        this.data = JSON.stringify(data.result);
        resolve(data);
      }, err => {
        this.data = '{"Error": "Error al guardar la contraseña"}';
        console.log(err);
      });
    });
  }
  
  public validatePasscode(variables) {
    let passcodeInfo = JSON.stringify(variables);
    return new Promise((resolve, reject) => {
      this.http.post(WS_BASE+'validatePasscode', passcodeInfo)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
  
  public updatePasscode(variables) {
    let passcodeInfo = JSON.stringify(variables);
    return new Promise((resolve, reject) => {
      this.http.post(WS_BASE+'updatePasscode', passcodeInfo)
      .subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    });
  }
}