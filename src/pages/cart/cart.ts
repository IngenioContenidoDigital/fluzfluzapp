import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CartService } from '../../providers/cart.service';
import { CheckoutPage } from '../checkout/checkout';

/**
 * Generated class for the Cart page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
  providers: [CartService],
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
export class CartPage {

  public products:Array<Object>;
  public cart:any = {};
  public displayOptions:any = 0;
  public index:any = -1;
  public textEditButton:string = "Editar";
  public showTerms = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public cartService: CartService) {
  }

  ionViewDidLoad() {
    this.updateDataView();
  }
  
  edit(){
    if( this.displayOptions == "0" ) {
      this.textEditButton = "Actualizar";
      this.displayOptions = "135px";
      this.index = 0;
    }
    else {
      this.textEditButton = "Editar";
      this.displayOptions = "0";
      this.index = -1;
      this.updateCart();
    }
  }
 
  updateQuantity(value, id_product){
    if ( value == 0 ){
      for (var i = 0; i < this.products.length; i++) {
        if ( this.products[i]['id_product'] == id_product && this.products[i]['quantity'] > 0 ){
          this.products[i]['quantity']--;
        }
      }
    }
    else if ( value == 1){
      for (var i = 0; i < this.products.length; i++) {
        if ( this.products[i]['id_product'] == id_product ){
          this.products[i]['quantity']++;
        }
      }
    }
  }
  
  removeProduct(id_product) {
    for (var i = 0; i < this.products.length; i++) {
      if ( this.products[i]['id_product'] == id_product ){
        this.products[i]['quantity'] = 0;
      }
    }
    this.updateCart();
  }
  
  updateCart(){
    this.cart.products = this.products;
    this.cartService.updateCart( this.cart ).subscribe(
      success => {
        if(success.status === 200) {
          this.storage.set('cart', JSON.parse(success._body));
          setTimeout(()=>{ this.updateDataView() }, 100);
        }
        if(success.status === 204) {
          this.storage.set('cart', 'null'); 
         setTimeout(()=>{ this.updateDataView() }, 100);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  
  updateDataView () {
    this.storage.get('cart').then((val) => {
      this.cart = ( val != undefined && val != null && val != '' ) ? val : {};
      this.products = ( val != undefined && val != null && val != '' ) ? val.products : [];
      console.log( "Estos son los productos: " );
      console.log( this.products );
    });
  }
  
  goTo(value) {
    switch (value){
      case "checkoutPage": {
        this.navCtrl.push( CheckoutPage,{
          cart: this.cart
        });
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
}
