import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, } from '@angular/forms';
import { TabsService } from '../../providers/tabs.service';
import { MyAccountService } from '../../providers/myAccount.service';
import { PaymentFluzService } from '../../providers/paymentfluz.service';
import { CartService } from '../../providers/cart.service';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { AnalyticsService } from '../../providers/analytics.service';

@Component({
  selector: 'page-paymentfluz',
  templateUrl: 'paymentfluz.html',
  providers: [
    MyAccountService,
    PaymentFluzService,
    CartService,
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
export class PaymentFluzPage {
  
  public userData:any = {};
  public cart:any = {};
  public singleValue:any = 0;
  public calcules:any = {};
  public payment:any = 0;
  public maxPayFluz:any;
  public enabledPayButton: boolean = false;
  public enabledPaymentRemaining: boolean = true;
  
  paymentFluzForm: FormGroup;
  
    constructor(
      private toastCtrl: ToastController,
      public loadingController: LoadingController,
      public cartService: CartService,
      private PaymentFluzService: PaymentFluzService,
      public navCtrl: NavController,
      public navParams: NavParams,
      public myAccount: MyAccountService,
      public storage: Storage,
      public tabsService: TabsService,
      public analytics: AnalyticsService
    ) {
        
    }

  ionViewWillEnter(){
    this.analytics.trackView('PaymentFluzPage');
    this.tabsService.hide();
    this.updateFluzTotals();
    this.updateDataView();
    this.calcules.fluz_result = 0;
    setTimeout(()=>{ this.calcules.you_may = this.cart.order_total }, 200);
    setTimeout(()=>{ this.singleValue = (this.cart.total_discounts/25) }, 200);
    setTimeout(()=>{ this.updateCalcules() }, 200);
    setTimeout(()=>{ this.enabledPayButton = false; }, 201);
  }
  
  ionViewWillLeave(){
    this.tabsService.show();
  }
  
  updateFluzTotals() {
    this.storage.get('userData').then((val) => {
      this.myAccount.getDataAccount(val.id).then(
        (data:any) => {
          this.userData = Object.assign(this.userData, JSON.parse(data));
          this.userData.fluzTotal = this.userData.fluzTotal == null ? 0 : this.userData.fluzTotal;
          setTimeout(()=>{ this.maxPayFluz = ( this.cart.total_price_in_points >= this.userData.fluzTotal ) ? this.userData.fluzTotal : this.cart.total_price_in_points; }, 200);
        }
      );
    });
  }
  
  updateDataView () {
    this.storage.get('cart').then((val) => {
      this.cart = ( val != undefined && val != null && val != '' ) ? val : {};
    });
  }
  
  inputChange(){
    this.updateCalcules();
  }
  
  updateCalcules(){
    this.calcules.you_may = (this.cart.total_products - (this.singleValue * 25 ));
    this.calcules.fluz_result = ( this.userData.fluzTotal - this.singleValue);
    if ( this.singleValue != 0 || this.singleValue != "" ) {
        this.enabledPayButton = true;
        this.enabledPaymentRemaining = false;
    } else {
        this.enabledPayButton = false;
        this.enabledPaymentRemaining = true;
    }
  }
  
  selectedPayment(value){
    this.payment = value;
  }
  
  goTo(value) {
    switch (value){
      case "payment": {
        switch (this.payment){
          case 1:{
            break            
          }
          case 2:{
            this.navCtrl.push( PaymentFluzPage,{
              cart: this.cart
            });
            break            
          }
        }
        
        break;
      }
      default: {
        this.navCtrl.pop();        
        break;
      }
    }
  }

    pay():void {
        this.storage.get('userData').then((userData) => {
            this.storage.get('cart').then((cartData) => {
                let loader = this.loadingController.create({
                    content: "Aplicando Puntos..."
                });
                loader.present();
                this.PaymentFluzService.applyPoints(userData.id,cartData,this.singleValue).subscribe(
                    success => {
                        loader.dismiss();
                        if(success.status === 200) {
                            this.storage.set('cart', JSON.parse(success._body)).then((cartData) => {
                                this.sendNotification("Fluz aplicados");
                                this.navCtrl.pop();
                            });;
                        } else {
                            this.sendNotification("Error aplicando fluz.");
                        }
                    },
                    error => {
                        loader.dismiss();
                        console.log(error)
                    }
                );
            });
        });
    }
    
    sendNotification(message:string):void {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 1000,
            position: 'middle'
        });
        toast.present();
    }

}
