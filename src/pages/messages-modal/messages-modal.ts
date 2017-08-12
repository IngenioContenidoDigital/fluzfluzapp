import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MessagesModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-messages-modal',
  templateUrl: 'messages-modal.html',
})
export class MessagesModalPage {
  public conversation:any;
  public userData:any;
  public userId:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.conversation = navParams.get('conversation');
    this.userData = navParams.get('userData');
    this.userId = navParams.get('userId');
  }

  dismiss(send:any = false) {
    this.viewCtrl.dismiss( { send: send } );
  }


}