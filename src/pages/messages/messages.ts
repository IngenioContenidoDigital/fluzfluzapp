import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MessagesService } from '../../providers/messages.service';
import { MessagesModalPage } from '../messages-modal/messages-modal';
import { MessageModalPage } from '../message-modal/message-modal';
import { AnalyticsService } from '../../providers/analytics.service';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
  providers: [
    MessagesService,
    AnalyticsService
  ]
})
export class MessagesPage {

  public conversations:any;
  
  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public messages: MessagesService,
    public analytics: AnalyticsService
  ) {
  }

  ionViewWillEnter(){
    this.analytics.trackView('MessagesPage');
    this.getConversations();
  }
  
  getConversations(){
    this.storage.get('userData').then((val) => {
      this.messages.getConversations(val.id).then(
        (data:any) => {
          this.conversations = data;
        }
      );
    });
  }
  
  openMessagesModal(item:any) {
    this.storage.get('userData').then((val) => {
      this.messages.getConversation(val.id, item.customer).then(
        (data:any) => {
          let messagesModal = this.modalCtrl.create( MessagesModalPage, { userId: val.id, conversation: data, userData: item } );
          messagesModal.onDidDismiss((data:any) => {
            if(data.send == true){
              item.img = item.image;
              item.id = item.customer;
              let messageModal = this.modalCtrl.create( MessageModalPage, { destiny: item } );
              messageModal.present();
            }
          });
          messagesModal.present();
        }
      );
    });
  }
}
