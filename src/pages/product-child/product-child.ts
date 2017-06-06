import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchService } from '../../providers/search.service';
import { CartService } from '../../providers/cart.service';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ProductChild page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-product-child',
  templateUrl: 'product-child.html',
  providers: [SearchService, CartService]
})
export class ProductChildPage {
  public manufacturer:any = {};
  public productFather:any = {};
  public productChild:any = {};
  public intructions:any = '';
  public terms:any = '';
  public inform:any;
  public idCart:any = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public searchService: SearchService, public cartService: CartService, public storage: Storage) {
    this.inform = "instructions";
    this.manufacturer = navParams.get("manufacturer");
    this.productFather = navParams.get("productFather");
    this.searchService.search( this.productFather.id_parent, '3' ).then((data) => {
      this.productChild = data;
      console.log(this.productChild.result);
      this.intructions = this.productChild.result['0'].instructions;
      this.terms = this.productChild.result['0'].terms;
    });
  }

  addToCart(idProduct:any){
    this.storage.get('cart').then((val) => {
      this.idCart = ( val != undefined && val != null && val != '' ) ? val.id : 0;
        
      this.cartService.addToCart( this.idCart, idProduct).subscribe(
        success => {
          if(success.status === 200) {
            this.storage.set('cart', JSON.parse(success._body));
          }
        },
        error =>{
          console.log(error)
        }
      ); 
    });
  }
}
