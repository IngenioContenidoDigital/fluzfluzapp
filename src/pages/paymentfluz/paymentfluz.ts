import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MyAccountService } from '../../providers/myAccount.service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the Paymentfluz page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-paymentfluz',
  templateUrl: 'paymentfluz.html',
  providers: [MyAccountService]
})
export class PaymentFluzPage {
  
  public userData:any = {};
  public cart:any = {};
  public singleValue:any = 0;
  public calcules:any = {};
  public payment:any = 0;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public myAccount: MyAccountService, public storage: Storage) {
  }

  ionViewWillEnter(){
    this.updateFluzTotals();
    this.updateDataView();
    setTimeout(()=>{ this.calcules.you_may = this.cart.order_total }, 200);
    this.calcules.fluz_result = 0;
  }
  
  updateFluzTotals() {
    this.storage.get('userData').then((val) => {
      this.myAccount.getDataAccount(val.id).then(
        (data:any) => {
          this.userData = Object.assign(this.userData, JSON.parse(data));
          this.userData.fluzTotal = this.userData.fluzTotal == null ? 0 : this.userData.fluzTotal;
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
    this.calcules.you_may = (this.cart.order_total - (this.singleValue * 25 ));
    this.calcules.fluz_result = ( this.userData.fluzTotal - this.singleValue);
  }
  
  selectedPayment(value){
    this.payment = value;
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
}
