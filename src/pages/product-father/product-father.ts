import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchService } from '../../providers/search.service';
import { ProductChildPage } from '../product-child/product-child';

/**
 * Generated class for the Product page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-product-father',
  templateUrl: 'product-father.html',
  providers: [SearchService]
})
export class ProductFatherPage {
  
  public manufacturer:any = {};
  public productFather:any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public searchService: SearchService)  {
    this.manufacturer = navParams.get("manufacturer");
    this.searchService.search( this.manufacturer.m_id, '2' ).then((data) => {
      this.productFather = data;
      if( this.productFather.total == 1 ){
        setTimeout(()=>{ this.openItem( this.productFather.result['0'] ); }, 300 );
      }
    });
  }
  
  openItem(item:any) {
    this.navCtrl.push(ProductChildPage,{
      manufacturer: this.manufacturer,
      productFather: item
    });
  }
  
  toggleDetails(data:any) {
    if (data.showDetails) {
      data.showDetails = false;
    } else {
      data.showDetails = true;
    }
  }

}
