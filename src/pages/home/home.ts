import { Component, ViewChild, ElementRef } from '@angular/core';
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
import { SHOW_HOME_CATEGORY } from '../../providers/config';
import { SHOW_LASTED_FLUZ } from '../../providers/config';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MyAccountService, HomeService, CategoryService]
})
export class HomePage {
  
  
  // Maps
  @ViewChild('map') mapElement: ElementRef;
  public map: any;
  public markers: any = [];
  public ubication:any = '';
  public latitude:any;
  public longitude:any;
  
  public userData:any = {};
  public showHomeUserData:any = false;
  public bannerData:any = {};
  public categoryFatherData:any = [];
  public categoryWithOutFatherData:any = [];
  public backgroundDefault:any = "https://s3.amazonaws.com/imagenes-fluzfluz/c/3-category_default.jpg";
  public category:any = false;
  public productChild:any = [];
  public countbannerData:any = 0;
  public homeCategories:any = SHOW_HOME_CATEGORY;
  public lastedFluz:any = SHOW_LASTED_FLUZ;
    
  @ViewChild(Slides) slides: Slides;
  
  constructor(
    public navCtrl: NavController, public storage: Storage, public splashScreen: SplashScreen, public myAccount: MyAccountService, public home: HomeService, public categoryService: CategoryService, public tabsService: TabsService, public geolocation: Geolocation
    ) {
      this.countbannerData = 0;
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
        this.storage.get('userConfirm').then((userConfirm)=> {
        if ( val !== false ){
          if (val === null || val === undefined ){
            this.goTo("LoginPage");
          }
          else if( userConfirm !== true ){
            this.goTo("ConfirmPage");            
          }
          if (val === null || val === undefined || val == false){
            this.updateShowDataUser(false);
          }
          else {
            this.updateShowDataUser(true);          
          }
        }
      });
    });
    setTimeout(()=>{
      this.getUserData();
      this.getBannerData();
      this.getCategoryWithFatherData();
      this.getCategoryWithOutFatherData();
    }, 100 );
    setTimeout(()=>{
      this.countbannerData = Object.keys(this.bannerData).length;
    }, 500 );
    this.splashScreen.hide();
    this.inizializateMap();
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
    this.categoryService.getCategory( 2, 0, 4 ).then(
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
  
  inizializateMap(){
    this.getUbication();
    setTimeout(()=>{
      this.ubication != '' ? this.loadMap() : this.inizializateMap();
    }, 200 );
  }
  
  getUbication(){
    this.geolocation.getCurrentPosition().then((position) => {
        this.ubication = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      }, (err) => {
//      console.log(err);
    });
  }
  
  loadMap(){
    let mapOptions = {
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: true,
      rotateControl: true,
      fullscreenControl: true,
      backgroundColor: "#f2f2f2",
      clickableIcons: false,
      center: this.ubication,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.getLocations();
  }
  
  getLocations(){
    this.home.getMapData(this.latitude, this.longitude, 1).then((data:any)=>{
      for(let pos of data.result){
        this.addMarker(pos.latitude, pos.longitude);
      }
    });
//    let location = {
//      lat: 4.71103,
//      lng: -74.11187
//    }
//    setTimeout(()=>{
//      this.addMarker(location.lat, location.lng);
//      this.addRadius();
//    }, 500 );
  }
  
  addMarker(lat: number, lng: number): void {
    let img = {
      url: 'assets/img/pointer.svg',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    let latLng = new google.maps.LatLng(lat, lng);
    let marker = new google.maps.Marker({
      map: this.map,
      position: latLng,
      icon: img,
      opacity: 0.7
    });
    this.markers.push(marker); 
  }
  
  addRadius() {
    let circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map,
      center: this.ubication,
      radius: 10000
    });
  }
}
