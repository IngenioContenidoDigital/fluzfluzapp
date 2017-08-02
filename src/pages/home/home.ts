import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Slides, LoadingController, ModalController } from 'ionic-angular';
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
import { ProductModalPage } from '../product-modal/product-modal';
import { SHOW_HOME_CATEGORY } from '../../providers/config';
import { SHOW_LASTED_FLUZ } from '../../providers/config';
import { DEV_UBICATION } from '../../providers/config';
import { Geolocation } from '@ionic-native/geolocation';
import { SearchService } from '../../providers/search.service';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MyAccountService, HomeService, CategoryService, SearchService]
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
  public devUbication:any = DEV_UBICATION;
  public homeCategories:any = SHOW_HOME_CATEGORY;
  public lastedFluz:any = SHOW_LASTED_FLUZ;
    
  @ViewChild(Slides) slides: Slides;
  
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public splashScreen: SplashScreen,
    public myAccount: MyAccountService,
    public home: HomeService,
    public categoryService: CategoryService,
    public tabsService: TabsService,
    public geolocation: Geolocation,
    private searchService: SearchService,
    public loadingController: LoadingController,
    public modalCtrl: ModalController
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
      this.inizializateMap();
    }, 500 );
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
    this.productChild.p_name = item.pf_name;
    this.productChild.online_only = item.online_only;
    
    this.navCtrl.push(ProductChildPage,{
      manufacturer: this.productChild,
      productFather: this.productChild
    });
  }
  
  inizializateMap(){
    this.getUbication();
    setTimeout(()=>{
      this.ubication != '' ? this.loadMap() : this.inizializateMap();
      this.ubication != '' ? this.setMyUbication() : this.inizializateMap();
    }, 200 );
  }
  
  setMyUbication() {
    let img = {
      url: this.userData.image == false ? 'assets/img/user-red.png' : this.userData.image ,
      size: new google.maps.Size(80, 80),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(30, 30)
    };
    setTimeout(()=>{
      this.addMarker(this.latitude, this.longitude, img, true, false, true, false);
    }, 500 );
  }
  
  getUbication(){
    if(!this.devUbication){
      this.geolocation.getCurrentPosition().then((position) => {
          this.ubication = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        }, (err) => {
  //      console.log(err);
      });      
    }
    else {
      this.latitude = 4.71103;
      this.longitude = -74.11187;
      this.ubication = {
        lat: this.latitude,
        lng: this.longitude
      }
    }
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
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.getLocations();
  }
  
  getLocations(){
    this.home.getMapData(this.latitude, this.longitude, 1).then((data:any)=>{
      for(let pos of data.result){
        let scaledSize = 10;
        if(pos.size != 1){ 
          if(pos.size >= 2 && pos.size <= 4){
            scaledSize = 15;
          }
          if(pos.size >= 5 && pos.size <= 8){
            scaledSize = 20;
          }
          if(pos.size >= 9 && pos.size <= 11){
            scaledSize = 25;
          }
          if(pos.size >= 12 && pos.size <= 15){
            scaledSize = 30;
          }
          if(pos.size > 15){
            scaledSize = 35;
          }
        } 
        let markerPlace = {
          url: 'assets/img/pointer.svg',
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(scaledSize, scaledSize)
        };
        this.addMarker(pos.latitude, pos.longitude, markerPlace, false, true);
      }
    });
  }
  
  addMarker(lat: number, lng: number, img:any, animation = false, opacity = false, zindex = false, clickeable = true): void {
    let latLng = new google.maps.LatLng(lat, lng);
    let marker = new google.maps.Marker({
      map: this.map,
      position: latLng,
      icon: img,
      opacity: opacity ? 0.7 : '',
      animation: animation ? google.maps.Animation.DROP : '',
      zIndex: zindex ? google.maps.Marker.MAX_ZINDEX + 1 : '',
      clickable: clickeable
    });
    this.markers.push(marker);
    google.maps.event.addListener(marker, 'click', () => {
      //infoWindow.open(this.map, marker);
      let loader = this.loadingController.create({
        content: "Cargando..."
      });
      loader.present();
      let position = marker.getPosition();
      let lat = position.lat();
      let lng = position.lng();
      console.log(lat);
      console.log(lng);
      this.searchService.searchByMap( lat, lng ).then((data:any) => {
        loader.dismiss();
        let messageModal = this.modalCtrl.create( ProductModalPage, { productMap: data, result: data.result } );
        messageModal.onDidDismiss(data => {
        });
        messageModal.present();
      });
    });
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
