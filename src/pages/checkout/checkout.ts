import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PaymentFluzPage } from '../paymentfluz/paymentfluz';
import { CreditCardPage } from '../creditcard/creditcard';
import { PaymentPsePage } from '../paymentpse/paymentpse';
import { TabsService } from '../../providers/tabs.service';
import { PaymentFluzService } from '../../providers/paymentfluz.service';
import { LoadingController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { SHOW_SAVINGS } from '../../providers/config';
import { PersonalInformationService } from '../../providers/personalinformation.service';
import { AnalyticsService } from '../../providers/analytics.service';

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
  providers: [
    PaymentFluzService,
    PersonalInformationService,
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
export class CheckoutPage {

  public cart:any = {}; 
  public payment:any = 0;
  public products:any = 0;
  public discounts:any = [];
  public showTerms:any = false;
  public showSavings = SHOW_SAVINGS;
  
  public creditCardSaved:any = [];
  
 constructor(
    private alertCtrl: AlertController,
    private PaymentFluzService: PaymentFluzService,
    private personalInformationService: PersonalInformationService,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public tabsService: TabsService,
    public analytics: AnalyticsService
  ){
    this.cart = navParams.get("cart");
  }

  ionViewDidLoad() {
    this.updateDataView();
  }

  selectedPayment(value){
    this.payment = value;
  }
  
  updateDataView () {
    this.storage.get('cart').then((val) => {
      this.cart = ( val != undefined && val != null && val != '' ) ? val : {};
      this.products = ( val != undefined && val != null && val != '' ) ? val.products : [];
      this.discounts = ( val != undefined && val != null && val != '' ) ? val.discounts : [];
    });
  }
  
  goTo(value) {
    switch (value){
      case "payment": {
          if ( this.cart.order_total == 0 ) {
                this.storage.get('userData').then((userData) => {
                    this.storage.get('cart').then((cart) => {
                        let loader = this.loadingController.create({
                            content: "Pagando..."
                        });
                        loader.present();
                        this.PaymentFluzService.sendPayment(userData,cart).subscribe(
                            success => {
                                loader.dismiss();
                                let response = JSON.parse(success._body);
                                if ( response.success ) {
                                    this.storage.remove('cart').then((cart) => {
                                        let title = 'Transacción Exitosa';
                                        let message = response.message;

                                        let alert = this.alertCtrl.create({
                                            title: title,
                                            message: message,
                                            buttons: [
                                                {
                                                    text: 'Seguir Comprando',
                                                    handler: () => {
                                                        this.tabsService.changeTabInContainerPage(0);
                                                        this.navCtrl.setRoot(TabsPage);
                                                    }
                                                },
                                                {
                                                    text: 'Ver Mis Bonos',
                                                    handler: () => {
                                                        this.tabsService.changeTabInContainerPage(1);
                                                        this.navCtrl.setRoot(TabsPage);
                                                    }
                                                }
                                            ]
                                        });
                                        alert.present();
                                    });
                                }
                            },
                            error => {
                                console.log(error)
                            }
                        );
                    });
                });
          } else {
            switch (this.payment){
              case 1:{
                this.navCtrl.push(CreditCardPage,{creditCardSaved: this.creditCardSaved});
                break            
              }
              case 2:{
                this.navCtrl.push( PaymentFluzPage,{
                  cart: this.cart
                });
                break            
              }
              case 3:{
                this.navCtrl.push( CreditCardPage );
                break            
              }
              case 4:{
                this.navCtrl.push( PaymentPsePage );
                break            
              }
            }
            break;
          }
      }
      default: {
        this.navCtrl.pop();        
        break;
      }
    }
  }
  
    getSevedCreditCard(){
        this.storage.get('userData').then((userData) => {
            this.personalInformationService.getSevedCreditCard(userData.id).subscribe(
                success => {
                    if(success.status === 200) {
                        this.creditCardSaved = JSON.parse(success._body);
                    }
                }
            );
        });
    }
  
  updateShowTerms(item){
    this.showTerms = this.showTerms != item.id_product ? item.id_product : false;
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('CheckoutPage');
    this.updateDataView();
    this.tabsService.hide();
    this.getSevedCreditCard();
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }
}
