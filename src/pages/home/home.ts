import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ConfirmPage } from '../confirm/confirm';
import { CategoryPage } from '../category/category';
import { CategoriesPage } from '../categories/categories';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyAccountService } from '../../providers/myAccount.service';
import { HomeService } from '../../providers/home.service';
import { CategoryService } from '../../providers/category.service';
import { TabsService } from '../../providers/tabs.service';
import { ProductChildPage } from '../product-child/product-child';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MyAccountService, HomeService, CategoryService]
})
export class HomePage {
  
  public userData:any = {};
  public showHomeUserData:any = false;
  public bannerData:any = {};
  public categoryFatherData:any = [];
  public categoryWithOutFatherData:any = [];
  public backgroundDefault:any = "https://s3.amazonaws.com/imagenes-fluzfluz/c/3-category_default.jpg";
  public category:any = false;
  public productChild:any = [];
    
  @ViewChild(Slides) slides: Slides;
  
  constructor(
    public navCtrl: NavController, public storage: Storage, public splashScreen: SplashScreen, public myAccount: MyAccountService, public home: HomeService, public categoryService: CategoryService, public tabsService: TabsService 
    ) {
      this.tabsService.show();
    }
  
  goTo(value:any) {
    switch (value){
      case "ConfirmPage": {
        this.navCtrl.push( ConfirmPage );
        break;
      }
      case "LoginPage": {
        this.navCtrl.push( LoginPage );
        break;
      }
      default: {
        this.navCtrl.pop();        
        break;
      }
    }
  }
   
  ionViewWillEnter(){
    this.storage.get('userData').then((val) => {
      if ( val !== false ){
        if (val === null || val === undefined ){
          this.goTo("LoginPage");
        }
        if (val === null || val === undefined || val == false){
          this.updateShowDataUser(false);
        }
        else {
          this.updateShowDataUser(true);          
        }
      }
    });
    setTimeout(()=>{
      this.getUserData();
      this.getBannerData();
      this.getCategoryWithFatherData();
      this.getCategoryWithOutFatherData();
    }, 100 );
    this.splashScreen.hide();
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
        );
      }
    });
  }
  
  getBannerData() {
    this.home.getBanner().then(
      (data:any) => {
        this.bannerData = data.result;
      }
    );
  }
  
  updateShowDataUser(value:any){
    this.showHomeUserData = value;
  }
  
  getCategoryWithFatherData() {
    this.categoryService.getCategory( 1 ).then(
      (data:any) => {
        this.categoryFatherData = data.result;
      }
    );
  }
  
  getCategoryWithOutFatherData(){
    this.categoryService.getCategory( 2, 0, 6 ).then(
      (data:any) => {
        this.categoryWithOutFatherData = data.result;
      }
    );
  }
  
  openCategoryById( item:any ){
    this.categoryService.getCategory( 3, item.id_category ).then(
      (data:any) => {
        this.navCtrl.push( CategoryPage, {
          category: item,
          products: data.products
        });
      }  
    );
  }
  
  openViewAllCategories(){
   this.categoryService.getCategory( 2 ).then(
      (data:any) => {
        this.navCtrl.push( CategoriesPage, {
          categories: data.result
        });
      }
    );
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
