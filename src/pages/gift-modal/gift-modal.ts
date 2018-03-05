import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { ViewController, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { TransferFluzService } from '../../providers/transferfluz.service';
import { BonusService } from '../../providers/bonus.service';
import { Storage } from '@ionic/storage';
import { AnalyticsService } from '../../providers/analytics.service';

@Component({
  selector: 'page-gift-modal',
  templateUrl: 'gift-modal.html',
  providers: [
    BonusService,
    TransferFluzService,
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
export class GiftModalPage {
  
  public bonus:any;
  public fluzzers:any = [];
  public fluzzerSelected:string = "";
  public notFound:any = false;
  public searchBox:string = "";
  public displayGiftBonus:any = false;
  public message:string = '';
  
  constructor(
    public storage: Storage,
    public toastCtrl: ToastController,
    public bonusService: BonusService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public transferFluz: TransferFluzService,
    public loadingController: LoadingController,
    public viewCtrl: ViewController,
    public analytics: AnalyticsService
  ) {
    this.bonus = navParams.get('bonus');
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('GiftModalPage');
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  searchFluzzer() {
    this.fluzzers = [];
    this.fluzzerSelected = "";
    this.notFound = false;
    setTimeout(()=>{
      if ( this.searchBox != "" ) {
        this.storage.get('userData').then(
          (userData:any) => {
            this.transferFluz.searchFluzzers(this.searchBox, userData.id).then(
              (response:any) => {
                if ( response.success ) {
                  this.fluzzers = response.fluzzers;
                } else {
                  this.notFound = true;
                }
              },
              error => {
                console.log(error)
              }
            );
          }
        )
        .catch(function () {
          console.log("Error");
        });
      }
    }, 500);
    this.enableSendGift();
  }
  
  enableSendGift() {
    if ( this.fluzzerSelected != "" ) {
      this.displayGiftBonus = true;
    } else {
      this.message = '';
      this.displayGiftBonus = false;
    }
  }

  
  sendGift(){
    let loader = this.loadingController.create({
      content: "Enviando..."
    });
    loader.present();
    this.storage.get('userData').then(
      (userData) => {
        this.bonusService.sendGift(userData.id, this.fluzzerSelected, this.bonus.card_code, this.bonus.id_product_code, this.message, userData.firstname).then(
          (data:any)=>{
            loader.dismiss();
            let toast = this.toastCtrl.create({
              message: data.msg,
              duration: 2500,
              position: 'middle'
            });
            toast.present();
            if(data.error == 0){
              this.dismiss();
            }
          }
        )
        .catch(function () {
          console.log("Error");
        });
      }
    )
    .catch(function () {
      console.log("Error");
    });
    
    
  }
}