import { Component, ViewChild } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { AnalyticsService } from '../../providers/analytics.service';

@Component({
  selector: 'page-messages-modal',
  templateUrl: 'messages-modal.html',
  providers: [
    AnalyticsService
  ]
})
export class MessagesModalPage {
  public conversation:any;
  public userData:any;
  public userId:any;
  @ViewChild(Content) content: Content;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public analytics: AnalyticsService
  ) {
    this.conversation = navParams.get('conversation');
    this.userData = navParams.get('userData');
    this.userId = navParams.get('userId');
  }

  dismiss(send:any = false) {
    this.viewCtrl.dismiss( { send: send } );
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('MessagesModalPage');
    setTimeout(()=>{ this.scrollToBottom(); }, 200);
  }
  
  scrollToBottom() {
    this.content. scrollToBottom(300);
  }

}