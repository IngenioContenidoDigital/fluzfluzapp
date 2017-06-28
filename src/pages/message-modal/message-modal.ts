import { Component, trigger, style, animate, state, transition  } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { NetworkService } from '../../providers/network.service';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the MessageModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-message-modal',
  templateUrl: 'message-modal.html',
  providers: [NetworkService],
  animations: [
    trigger('slideIn', [
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition('* => void', [
          style({ height: '*' }),
          animate(250, style({ height: 0 }))
      ]),
      transition('void => *', [
          style({ height: '0' }),
          animate(250, style({ height: '*' }))
      ])
    ])
  ]
})
export class MessageModalPage {

  public destiny:any;
  public message:string = '';
  public enableContinue:any = true;
//  public resultMessage:any = false;
  
  constructor(public loadingController: LoadingController, public storage: Storage, public network: NetworkService, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.destiny = navParams.get('destiny');
    this.message = 'Hola! '+ this.destiny.username + ', ';
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  validateMessage(ev){
    this.enableContinue = ( this.message != '' && this.message != null ) ? true : false;
  }
  
  sendMessage() {
    let loader = this.loadingController.create({
      content: "Enviando..."
    });
    loader.present();
    this.storage.get('userId').then((val) => {
      this.network.sendMessage(val, this.destiny.id, this.message).then(
        (data:any) => {
          if ( data == 'true' ){
            loader.dismiss();
            this.viewCtrl.dismiss();
          }
        }
      );
    });
  }
}
