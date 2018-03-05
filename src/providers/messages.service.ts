import { Injectable } from '@angular/core';
//import { Http, URLSearchParams, Response } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class MessagesService {

  public userData: any = {};
  public data:any = {};
    
  constructor(public http: HttpClient) {}

  public getConversations(id_customer:any) {
    let url = WS_BASE+'/getConversations';
    let params = new HttpParams().set('id_customer', id_customer);
    return new Promise(resolve => {
      this.http.get(url, { params: params })
        .subscribe(
        	(data:any) => {
            this.data = data.result;
            resolve(this.data);
          },
          (err) => {
            this.data = '{"Error": "Error al traer los datos del mapa"}';
            resolve(this.data);
          }
        );
    });
  }
  
  public getConversation(id_customer:any, id_customer_conversation:any) {
    let url = WS_BASE+'/getConversation';
    let Params = new HttpParams();
      Params = Params.append('id_customer', id_customer);
      Params = Params.append('id_customer_conversation', id_customer_conversation);
      return new Promise(resolve => {
        this.http.get(url, { params: Params })
          .subscribe(
            (data:any) => {
              this.userData = data.result;
              resolve( this.userData );
            },
            (err) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
  
  public getMessagesData(id_customer:any) {
    let url = WS_BASE+'/getMessagesData';
    let params = new HttpParams().set('id_customer', id_customer);
      return new Promise(resolve => {
        this.http.get(url, { params: params })
          .subscribe(
            (data:any) => {
              this.userData = data.result;
              resolve( this.userData );
            },
            (err) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
  
  public readConversation(id_customer:any, id_customer_conversation:any) {
    let url = WS_BASE+'/readConversation';
    let Params = new HttpParams();
    Params = Params.append('id_customer', id_customer);
    Params = Params.append('id_customer_conversation', id_customer_conversation);
    return new Promise(resolve => {
      this.http.get(url, { params: Params })
        .subscribe(
          (data:any) => {
            this.userData = data.result;
            resolve( this.userData );
          },
          (err) => {
            this.userData  = err.json();
            resolve(this.userData );
          }
        );
    });
  }
  
  
  
  public sendMessage(id_customer_send, id_customer_receive, message) {
    let url = WS_BASE+'sendMessage';
    let Params = new HttpParams();
    Params = Params.append('id_customer_send', id_customer_send);
    Params = Params.append('id_customer_receive', id_customer_receive);
    Params = Params.append('message', message);
    return new Promise(resolve => {
      this.http.get(url, { params: Params })
        .subscribe(
          (data:any) => {
            this.userData = JSON.stringify(data.result);
            resolve( this.userData );
          },
          (err) => {
            this.userData  = err.json();
            resolve(this.userData );
          }
        );
    });
  }
  
  
}
