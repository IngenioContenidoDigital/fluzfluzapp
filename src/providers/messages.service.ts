import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { WS_BASE } from './config';
import 'rxjs/add/operator/map';


@Injectable()
export class MessagesService {

  public userData: any = {};
  public data:any = {};
    
  constructor(public http: Http) {}

  public getConversations(id_customer:any) {
    let url = WS_BASE+'/getConversations';
    let params = new URLSearchParams();
      params.set('id_customer', id_customer);
      return new Promise(resolve => {
        this.http.get(url, { search: params })
          .map(res => res.json())
          .subscribe(
            data => {
              this.userData = data.result;
              resolve( this.userData );
            },
            (err:Response) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
  
  public getConversation(id_customer:any, id_customer_conversation:any) {
    let url = WS_BASE+'/getConversation';
    let params = new URLSearchParams();
      params.set('id_customer', id_customer);
      params.set('id_customer_conversation', id_customer_conversation);
      return new Promise(resolve => {
        this.http.get(url, { search: params })
          .map(res => res.json())
          .subscribe(
            data => {
              this.userData = data.result;
              resolve( this.userData );
            },
            (err:Response) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
  
  public getMessagesData(id_customer:any) {
    let url = WS_BASE+'/getMessagesData';
    let params = new URLSearchParams();
      params.set('id_customer', id_customer);
      return new Promise(resolve => {
        this.http.get(url, { search: params })
          .map(res => res.json())
          .subscribe(
            data => {
              this.userData = data.result;
              resolve( this.userData );
            },
            (err:Response) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
  
  public readConversation(id_customer:any, id_customer_conversation:any) {
    let url = WS_BASE+'/readConversation';
    let params = new URLSearchParams();
      params.set('id_customer', id_customer);
      params.set('id_customer_conversation', id_customer_conversation);
      return new Promise(resolve => {
        this.http.get(url, { search: params })
          .map(res => res.json())
          .subscribe(
            data => {
              this.userData = data.result;
              resolve( this.userData );
            },
            (err:Response) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
  
  
  
  public sendMessage(id_customer_send, id_customer_receive, message) {
    let url = WS_BASE+'sendMessage';
    let params = new URLSearchParams();
      params.set('id_customer_send', id_customer_send);
      params.set('id_customer_receive', id_customer_receive);
      params.set('message', message);
      return new Promise(resolve => {
        this.http.get(url, { search: params })
          .map(res => res.json())
          .subscribe(
            data => {
              this.userData = JSON.stringify(data.result);
              resolve( this.userData );
            },
            (err:Response) => {
              this.userData  = err.json();
              resolve(this.userData );
            }
          );
      });
  }
  
  
}
