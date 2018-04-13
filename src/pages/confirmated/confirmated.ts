import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { MyAccountService } from '../../providers/myAccount.service';
import { SHOW_SAVINGS } from '../../providers/config';
import { SHOW_LASTED_FLUZ } from '../../providers/config';
import { AnalyticsService } from '../../providers/analytics.service';
import { SearchService } from '../../providers/search.service';
import { ProductChildPage } from '../../pages/product-child/product-child';
import { ProductFatherPage } from '../../pages/product-father/product-father';
import { CategoryService } from '../../providers/category.service';
import { CategoryPage } from '../../pages/category/category';

@Component({
  selector: 'page-confirmated',
  templateUrl: 'confirmated.html',
  providers: [
    MyAccountService,
    AnalyticsService
  ]
})
export class ConfirmatedPage {
  
  public userData:any = {};
  public deeplink:any = false;
  public showSavings:any = SHOW_SAVINGS;
  public lastedFluz:any = SHOW_LASTED_FLUZ;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public tabsService: TabsService,
    public storage: Storage,
    public myAccount: MyAccountService,
    public searchService: SearchService,
    public categoryService: CategoryService,
    public analytics: AnalyticsService
  ) {
    this.deeplink = (navParams.get("deeplink") != undefined) ? navParams.get("deeplink"): this.deeplink;
  }

  ionViewWillEnter(){
    this.analytics.trackView('ConfirmatedPage');
    this.tabsService.hide();
    this.getUserData();
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }
  
  public goTo(){
    if(this.deeplink != false){
      this.openDeeplink(this.deeplink);
    }
    else {
      this.navCtrl.setRoot(TabsPage);
    }
  }
  
  openDeeplink(path:any){
    let deeplink = path.split("/");
    if(deeplink.length == 3){
      if(deeplink[2] == "mi-cuenta"){
        this.navCtrl.setRoot(TabsPage).then(()=>{
          setTimeout(()=>{
            this.tabsService.changeTabInContainerPage(4);
          },500);
        });
      }
      else{
        let category = deeplink[2].split("-");
        if(Number(category[0])){
          this.openCategoryById(category[0]);
        }
      }
    }
    else if(deeplink.length == 4){
      let product = deeplink[3].split("-");
      if(Number(product[0])){
        this.openProduct(product[0]);
      }
    }
  }
  
  openProduct(product:any){
    this.searchService.openDeeplink(1,product).then((response:any)=>{
      this.searchService.search( response.m_id, '2' ).then((data:any) => {
        if(data.total == 1){
          let productFather:any = data.result['0'];
          this.navCtrl.push(ProductChildPage,{
            manufacturer: response,
            productFather: productFather
          });
        }
        else {
          this.navCtrl.push(ProductFatherPage,{
            manufacturer: response
          });        
        }
      })
      .catch(error =>{
        console.log(error);
      });
    })
    .catch(error =>{
      console.log(error);
    });
  }
  
  openCategoryById( id_category:any ){
    this.searchService.openDeeplink(2,id_category).then((category:any)=>{
      if(category != null){
        this.categoryService.getCategory( 3, id_category ).then(
          (data:any) => {
            if(data != null){
              this.navCtrl.push( CategoryPage, {
                category: category,
                products: data.products
              });
              
            }
          }  
        )
        .catch(function () {
          console.log("Error");
        });
      }
    });
  }
  
  getUserData() {
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.userData.userName = val.firstname;
        this.myAccount.getDataAccount(val.id).then(
          (data:any) => {
            this.userData = Object.assign(this.userData, JSON.parse(data));
            this.userData.fluzLasted === null ? this.userData.fluzLasted = 0 : this.userData.fluzLasted = this.userData.fluzLasted;
          }
        )
        .catch(function () {
          console.log("Error");
        });
      }
    })
    .catch(function () {
      console.log("Error");
    });
  }
}
