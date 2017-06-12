import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductChildPage } from '../product-child/product-child';

/**
 * Generated class for the CategoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {

  public category:any = [];
  public products:any = [];
  
  public productChild:any = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.category = navParams.get("category");
    this.products = navParams.get("products");
  }
  
  openProductChild( item:any ) {
    
    this.productChild.image_manufacturer = item.image;
    this.productChild.id_parent = item.pf_id;
    
    this.navCtrl.push(ProductChildPage,{
      manufacturer: this.productChild,
      productFather: this.productChild
    });
  }

}
