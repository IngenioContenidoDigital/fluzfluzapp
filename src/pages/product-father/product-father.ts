import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchService } from '../../providers/search.service';
import { ProductChildPage } from '../product-child/product-child';
import { AnalyticsService } from '../../providers/analytics.service';

@Component({
  selector: 'page-product-father',
  templateUrl: 'product-father.html',
  providers: [
    SearchService,
    AnalyticsService
  ]
})
export class ProductFatherPage {
  
  public manufacturer:any = {};
  public productFather:any = {};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public searchService: SearchService,
    public analytics: AnalyticsService
  ){
    this.manufacturer = navParams.get("manufacturer");
    this.searchService.search( this.manufacturer.m_id, '2' ).then((data) => {
      this.productFather = data;
      if( this.productFather.total == 1 ){
        setTimeout(()=>{ this.openItem( this.productFather.result['0'] ); }, 300 );
      }
    })
    .catch(error =>{
      console.log(error);
    });
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('ProductFatherPage');
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
