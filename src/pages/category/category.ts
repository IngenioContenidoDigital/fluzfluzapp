import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductChildPage } from '../product-child/product-child';
import { TabsService } from '../../providers/tabs.service';
import { AnalyticsService } from '../../providers/analytics.service';

@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
  providers: [
    AnalyticsService
  ]
})
export class CategoryPage {

  public category:any = [];
  public products:any = [];
  
  public productChild:any = [];
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public tabsService: TabsService,
    public analytics: AnalyticsService
  ){
    this.category = navParams.get("category");
    this.products = navParams.get("products");
  }
  
  openProductChild( item:any ) {
    
    this.productChild.image_manufacturer = item.image;
    this.productChild.id_parent = item.pf_id;
    this.productChild.p_name = item.pf_name;
    this.productChild.online_only = item.online_only;
    
    this.navCtrl.push(ProductChildPage,{
      manufacturer: this.productChild,
      productFather: this.productChild
    });
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('CategoryPage');
    this.tabsService.hide();
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }

}
