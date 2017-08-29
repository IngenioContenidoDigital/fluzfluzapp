import { Component, ViewChild, ElementRef,  trigger, style, animate, state, transition } from '@angular/core';
import { NavController, Slides, LoadingController, ModalController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ConfirmPage } from '../confirm/confirm';
import { CategoryPage } from '../category/category';
import { CategoriesPage } from '../categories/categories';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyAccountService } from '../../providers/myAccount.service';
import { HomeService } from '../../providers/home.service';
import { InvitationThirdModalPage } from '../invitation-third-modal/invitation-third-modal';
import { CategoryService } from '../../providers/category.service';
import { TabsService } from '../../providers/tabs.service';
import { ProductChildPage } from '../product-child/product-child';
import { ProductModalPage } from '../product-modal/product-modal';
import { SHOW_HOME_CATEGORY } from '../../providers/config';
import { SHOW_LASTED_FLUZ } from '../../providers/config';
import { DEV_UBICATION } from '../../providers/config';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { SearchService } from '../../providers/search.service';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker, MarkerIcon } from '@ionic-native/google-maps';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [
    MyAccountService,
    HomeService,
    CategoryService,
    SearchService,
    GoogleMaps
  ],
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
export class HomePage {
  
  // Maps
  @ViewChild('map') mapElement: ElementRef;
  public element: HTMLElement = document.getElementById('map');
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
  public notificationBar:any = [];
  public profileBar:any = true;
    
  @ViewChild(Slides) slides: Slides;
  
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public splashScreen: SplashScreen,
    public myAccount: MyAccountService,
    public home: HomeService,
    public categoryService: CategoryService,
    public tabsService: TabsService,
    private searchService: SearchService,
    public loadingController: LoadingController,
    public modalCtrl: ModalController,
    
    public geolocation: Geolocation,
    public googleMaps: GoogleMaps
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
    this.notificationBar.setVisible = false;
    this.storage.get('userData').then((val) => {
      this.storage.get('userConfirm').then((userConfirm)=> {
        if (val === null || val === undefined || val === false){
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
          setTimeout(()=>{
            this.getUserData();
            this.getBannerData();
            this.getCategoryWithFatherData();
            this.getCategoryWithOutFatherData();
          }, 100 );
          setTimeout(()=>{
            this.home.getNotificationBarOrders(val.id).then((data:any)=>{
//                console.log(data.result);
              let notificationData = data.result;
              this.notificationBar = data.result;
              if(this.notificationBar.profile_complete<100){
                this.profileBar = true;
              }
              switch (notificationData.alert){
                case 4: {
                  this.notificationBar.setVisible = true;
                  this.notificationBar.text = "Tu cuenta se encuentra actualmente cancelada.";
                  break;
                }
                case 3: {
                  this.notificationBar.setVisible = true;
                  this.notificationBar.text = "Has hecho "+notificationData.orden+" de "+notificationData.quantity_max+" compras y te estas pasando de la fecha de vencimiento. Si no haces "+notificationData.quantity+" compras más hasta el ("+notificationData.dateCancel+") tu cuenta será cancelada!";
                  break;
                }
                case 2: {
                  this.notificationBar.setVisible = true;
                  this.notificationBar.text = "Increíble! Tu compra mensual mínima se ha cumplido.";
                  break;
                }
                case 1: {
                  this.notificationBar.setVisible = true;
                  this.notificationBar.text = "Has hecho "+notificationData.orden+" de "+notificationData.total+" compras. Necesitaras hacer "+notificationData.quantity+" compras más hasta el ("+notificationData.date+") para cubrir tu requisito mensual";
                  break;
                }
                default: {
                  this.notificationBar.setVisible = false;
                  break;
                }
              }
            });
            this.countbannerData = Object.keys(this.bannerData).length;
//              this.inizializateMap();
            this.getPosition();
          }, 500 );
        }
      });
    });
  }
  
  pushNewUser(){
    this.navCtrl.push(InvitationThirdModalPage);
  }
  
  closeNotification(){
    this.notificationBar.setVisible = false;
  }
  
  closeProfile() {
    this.profileBar = false;
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
  
  getPosition():any {
    this.geolocation.getCurrentPosition().then(response => {
      this.loadMap(response);
    })
    .catch(error =>{
      console.log(error);
    })
  }
  
  loadMap(postion: Geoposition){
    let latitude = postion.coords.latitude;
    let longitud = postion.coords.longitude;

    // create a new map by passing HTMLElement
    let element: HTMLElement = document.getElementById('map');

    // create controls
    let mapOptions = {
      'controls': {
        'compass': true,
        'myLocationButton': true,
        'indoorPicker': true,
        'zoom': true
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      },
      'building': true,
      'preferences': {
        'zoom': {
          'minZoom': 8,
          'maxZoom': 18
        }
      }
    }
    
    let map: GoogleMap = this.googleMaps.create(element, mapOptions);
    setTimeout(() => {
      map.setClickable(true);
    }, 100);
    // create LatLng object
    let myPosition: LatLng = new LatLng(latitude,longitud);

    // create CameraPosition
    let position: CameraPosition = {
      target: myPosition,
      zoom: 18,
      tilt: 30
    };
    map.one(GoogleMapsEvent.MAP_READY).then(()=>{
      // move the map's camera to position
      map.moveCamera(position);
      // Obtiene las ubicaciones de los comercios
      this.getLocations(latitude, longitud, map);
    });
  }
  
  getLocations(latitude:any, longitud:any, map: GoogleMap, ){
    this.home.getMapData(latitude, longitud, 1).then((data:any)=>{
      for(let pos of data.result){
        let position: LatLng = new LatLng(pos.latitude,pos.longitude);
        // Genera un marcador en el mapa.
        this.setMarker(map, position);
      }
    });
  }

  setMarker(map: GoogleMap, position:any){
    // create new marker
    let icon: MarkerIcon = {
      url: 'https://s3.amazonaws.com/imagenes-fluzfluz/app/marker.png',
      size: {
        width: 30,
        height: 30
      }
    }
    let markerOptions: MarkerOptions = {
      position: position,
      title: '¿Que hay aquí?'
    };
    map.addMarker(markerOptions).then((marker: Marker)=>{
      marker.setIcon(icon);
      marker.addEventListener(GoogleMapsEvent.INFO_CLICK).subscribe(() => {
        let loader = this.loadingController.create({
          content: "Cargando..."
        });
        loader.present();
        let lat = position.lat;
        let lng = position.lng;
        this.searchService.searchByMap( lat, lng ).then((data:any) => {
          loader.dismiss();
          let messageModal = this.modalCtrl.create( ProductModalPage, { productMap: data, result: data.result } );
          map.setClickable(false);
          messageModal.onDidDismiss(data => {
            map.setClickable(true);
          });
          messageModal.present();
        });
      });
    });
  }
   
//  
//  addMarker(lat: number, lng: number, icon:any, animation = false, opacity = false, zindex = false, clickeable = true): void {
//    let latLng = new google.maps.LatLng(lat, lng);
//    let marker = new google.maps.Marker({
//      map: this.map,
//      position: latLng,
//      icon: icon,
//      opacity: opacity ? 0.7 : '',
//      animation: animation ? google.maps.Animation.DROP : '',
//      zIndex: zindex ? google.maps.Marker.MAX_ZINDEX + 1 : '',
//      clickable: clickeable
//    });
//    this.markers.push(marker);
//    google.maps.event.addListener(marker, 'click', () => {
//      //infoWindow.open(this.map, marker);
//    });
//  }
//  
//  inizializateMap(){
//    this.getUbication();
//    setTimeout(()=>{
//      this.ubication != '' ? this.loadMap() : this.inizializateMap();
//      this.ubication != '' ? this.setMyUbication() : this.inizializateMap();
//    }, 200 );
//  }
//  
//  setMyUbication() {
//    let img = {
//      url: this.userData.image == false ? 'assets/img/user-red.png' : this.userData.image ,
//      size: new google.maps.Size(80, 80),
//      origin: new google.maps.Point(0, 0),
//      anchor: new google.maps.Point(17, 34),
//      scaledSize: new google.maps.Size(30, 30)
//    };
//    setTimeout(()=>{
//      this.addMarker(this.latitude, this.longitude, img, true, false, true, false);
//    }, 500 );
//  }
//  
//  getUbication(){
//    if(!this.devUbication){
//      this.geolocation.getCurrentPosition().then((position) => {
//          this.ubication = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//          this.latitude = position.coords.latitude;
//          this.longitude = position.coords.longitude;
//        }, (err) => {
//  //      console.log(err);
//      });      
//    }
//    else {
//      this.latitude = 4.71103;
//      this.longitude = -74.11187;
//      this.ubication = {
//        lat: this.latitude,
//        lng: this.longitude
//      }
//    }
//  }
  
//  loadMap(){
//    let mapOptions = {
//      zoomControl: false,
//      mapTypeControl: false,
//      streetViewControl: true,
//      rotateControl: true,
//      fullscreenControl: true,
//      backgroundColor: "#f2f2f2",
//      clickableIcons: false,
//      center: this.ubication,
//      zoom: 14,
//      mapTypeId: google.maps.MapTypeId.ROADMAP
//    }
//    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
//    this.getLocations();
//  }
  
  
  
//    
//  addRadius() {
//    let circle = new google.maps.Circle({
//      strokeColor: '#FF0000',
//      strokeOpacity: 0.8,
//      strokeWeight: 2,
//      fillColor: '#FF0000',
//      fillOpacity: 0.35,
//      map: this.map,
//      center: this.ubication,
//      radius: 10000
//    });
//  }
}
