import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PaymentFluzPage } from '../paymentfluz/paymentfluz';
import { CreditCardPage } from '../creditcard/creditcard';
import { PaymentPsePage } from '../paymentpse/paymentpse';
import { BitPayPage } from '../bitpay/bitpay';
import { TabsService } from '../../providers/tabs.service';
import { PaymentFluzService } from '../../providers/paymentfluz.service';
import { LoadingController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { SHOW_SAVINGS } from '../../providers/config';
import { PersonalInformationService } from '../../providers/personalinformation.service';
import { AnalyticsService } from '../../providers/analytics.service';
import { VaultService } from '../../providers/vault.service';

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
  providers: [
    PaymentFluzService,
    PersonalInformationService,
    VaultService,
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
  public historyData:any;
  public enablePayMethods:boolean = false;
  
  public creditCardSaved:any = [];
  
  constructor(
    private alertCtrl: AlertController,
    private PaymentFluzService: PaymentFluzService,
    private personalInformationService: PersonalInformationService,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public vault: VaultService,
    public tabsService: TabsService,
    public analytics: AnalyticsService
  ){
    this.cart = navParams.get("cart");
  }

  ionViewDidLoad() {
    this.updateDataView();
  }
  
  showAlert(title:string, msg:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }
  
  selectedPayment(value){
    if( value == 5 && this.cart.order_total < 300000 ){
      this.showAlert("Medio de pago no disponible","BitPay solo está disponible en compras superiores a $300.000 COP ó $100 USD");
    }
    else{
      this.payment = value;
    }
  }
  
  updateDataView () {
    this.storage.get('cart').then((val) => {
      this.cart = ( val != undefined && val != null && val != '' ) ? val : {};
      this.products = ( val != undefined && val != null && val != '' ) ? val.products : [];
      this.discounts = ( val != undefined && val != null && val != '' ) ? val.discounts : [];
    })
    .catch(function () {
      console.log("Error");
    });
  }
  
  updateHistory(){
    let loader = this.loadingController.create({
      content: "Cargando Métodos de pago..."
    });
    loader.present();
    this.getSevedCreditCard(loader);
//    this.storage.get('userData').then(
//      (val) => {
//        this.vault.getOrderHistory(val.id).then(
//          (data:any) => {
//            loader.dismiss();
//            this.historyData = data.result;
//            if(this.historyData.length > 0) {
//              this.enablePayMethods = true;
//            }
//            else {
//              this.enablePayMethods = false;
//            }
//          }
//        );
//      }
//    );
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
              console.log('Pagando');
              loader.present();
              this.PaymentFluzService.sendPayment(userData,cart).then(
                (response:any) => {
                  loader.dismiss();
//                  let response = JSON.parse(success._body);
                  if ( response.success ) {
                    this.storage.remove('cart').then((cart) => {
                      let title = 'Transacción Exitosa';
                      let message = response.message;
                      this.analytics.trackView('ConfirmPayPage');
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
                    })
                    .catch(function () {
                      console.log("Error");
                    });
                  }
                },
                error => {
                  console.log(error)
                }
              );
            })
            .catch(function () {
              console.log("Error");
            });
          })
          .catch(function () {
            console.log("Error");
          });
        }
        else {
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
            case 5:{
              this.navCtrl.push( BitPayPage );
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
  
  getSevedCreditCard(loader){
    this.storage.get('userData').then((userData) => {
      this.personalInformationService.getSevedCreditCard(userData.id).then(
        (response:any) => {
          loader.dismiss();
          if(response.success) {
            this.creditCardSaved = response.card;
          }
        },
        ()=>{
          loader.dismiss();
        }
      )
      .catch(function () {
        loader.dismiss();
        console.log("Error");
      })
    })
    .catch(function () {
        loader.dismiss();
        console.log("Error");
    });
  }
  
  updateShowTerms(item){
    this.showTerms = this.showTerms != item.id_product ? item.id_product : false;
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('CheckoutPage');
    this.updateDataView();
    this.tabsService.hide();
    this.updateHistory();
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }
}
