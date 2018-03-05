import { Component, trigger, style, animate, state, transition  } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { NetworkService } from '../../providers/network.service';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { AnalyticsService } from '../../providers/analytics.service';

@Component({
  selector: 'page-message-modal',
  templateUrl: 'message-modal.html',
  providers: [
    NetworkService,
    AnalyticsService
  ],
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
  
  constructor(
    public loadingController: LoadingController,
    public storage: Storage,
    public network: NetworkService,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public analytics: AnalyticsService
  ) {
    this.destiny = navParams.get('destiny');
    this.message = 'Hola! '+ this.destiny.username + ', ';
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('MessageModalPage');
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
    this.storage.get('userData').then((val) => {
      this.network.sendMessage(val.id, this.destiny.id, this.message).then(
        (data:any) => {
          console.log('data');
          console.log(data);
          if ( data == 'true' ){
            loader.dismiss();
            this.viewCtrl.dismiss();
          }
          else {
            loader.dismiss();
          }
        }
      )
      .catch(error =>{
        console.log(error);
      });
    })
    .catch(error =>{
      console.log(error);
    });
  }
}
