import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PaymentFluzPage } from '../paymentfluz/paymentfluz';
import { CreditCardPage } from '../creditcard/creditcard';
import { PaymentPsePage } from '../paymentpse/paymentpse';
import { TabsService } from '../../providers/tabs.service';
import { SHOW_SAVINGS } from '../../providers/config';

/**
 * Generated class for the Checkout page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
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
  public showTerms:any = false;
  public showSavings = SHOW_SAVINGS;
  
 constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public tabsService: TabsService) {
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
    });
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
      default: {
        this.navCtrl.pop();        
        break;
      }
    }
  }
  
  updateShowTerms(item){
    this.showTerms = this.showTerms != item.id_product ? item.id_product : false;
  }
  
  ionViewWillEnter(){
    this.tabsService.hide();
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }
}
