import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PaymentFluzPage } from '../paymentfluz/paymentfluz';
import { AddCreditCartPage } from '../addcreditcart/addcreditcart';
import { PaymentPsePage } from '../paymentpse/paymentpse';


/**
 * Generated class for the Checkout page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  public cart:any = {}; 
  public payment:any = 0;
  public products:any = 0;
 constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    this.cart = navParams.get("cart");
    console.log("este es el carro que llega");
    console.log(this.cart);
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
            console.log("Tarjeta 1");
            break            
          }
          case 2:{
            console.log("Tarjeta 2");
            this.navCtrl.push( PaymentFluzPage,{
              cart: this.cart
            });
            break            
          }
          case 3:{
            console.log("Tarjeta 3");
            this.navCtrl.push( AddCreditCartPage );
            break            
          }
          case 4:{
            console.log("Tarjeta 4");
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
}
