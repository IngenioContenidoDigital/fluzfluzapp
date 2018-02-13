import { Component, trigger, style, animate, state, transition,  EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Slides, Platform } from 'ionic-angular';
import { SearchService } from '../../providers/search.service';
import { CartService } from '../../providers/cart.service';
import { Storage } from '@ionic/storage';
import { TabsService } from '../../providers/tabs.service';
import { InstagramService } from '../../providers/instagram.service';
import { SHOW_SAVINGS } from '../../providers/config';
import { SHOW_MAP_PRODUCT_PAGE } from '../../providers/config';
import { BonusService } from '../../providers/bonus.service';
import { Geolocation } from '@ionic-native/geolocation';
import { AnalyticsService } from '../../providers/analytics.service';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BrowserTab } from '@ionic-native/browser-tab';
import { CartPage } from '../cart/cart';

declare var google;

@Component({
  selector: 'page-product-child',
  templateUrl: 'product-child.html',
  providers: [
    BonusService,
    SearchService,
    CartService,
    InstagramService,
    AnalyticsService
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
export class ProductChildPage {
  // Maps
  @ViewChild('map') mapElement: ElementRef;
  //Slides Instagram
  @ViewChild(Slides) slides: Slides;
  public map: any;
  public markers: any = [];
  public ubication:any = '';
  public latitude:any;
  public longitude:any;
  
  public manufacturer:any = {};
  public instragramData:any = [];
  public productFather:any = {};
  public productChild:any = {};
  public intructions:any = '';
  public countInstagramData:any = 0;
  public terms:any = '';
  public inform:any;
  public idCart:any = 0;
  public showSavings = SHOW_SAVINGS;
  public showMapProductPage = SHOW_MAP_PRODUCT_PAGE;
  public scheme:string = '';
  public showBuyBtn:boolean = true;
  public productMap:boolean = false;
  public infoFooter:any = [];
  
  @Output('updateCountCart')
  public updateCountCart: EventEmitter<number> = new EventEmitter<number>();
  
  @ViewChild('header') header;
  
  constructor(
    public platform: Platform,
    private browserTab: BrowserTab,
    public toastCtrl: ToastController,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public searchService: SearchService,
    public cartService: CartService,
    public storage: Storage,
    public tabsService: TabsService,
    public geolocation: Geolocation,
    public bonusService: BonusService,
    public instagramService: InstagramService,
    private iab: InAppBrowser,
    public analytics: AnalyticsService
  ) {
    this.inform = "instructions";
    this.manufacturer = navParams.get("manufacturer");
    this.productFather = navParams.get("productFather");
    this.productMap = navParams.get("productMap");
    this.searchService.search( this.productFather.id_parent, '3' ).then((data) => {
      this.productChild = data;
      this.intructions = this.productChild.result['0'].instructions;
      this.terms = this.productChild.result['0'].terms;
    });
  }

  addToCart(idProduct:any){
    let loader = this.loadingController.create({
      content: "Agregando..."
    });
    loader.present();
    this.storage.get('userData').then((userData) => {
      this.storage.get('cart').then((val) => {
        this.idCart = ( val != undefined && val != null && val != '' ) ? val.id : 0;
        this.cartService.addToCart( this.idCart, idProduct, userData.id ).subscribe(
          success => {
            loader.dismiss();
            if(success.status === 200) {
              this.storage.set('cart', JSON.parse(success._body));
              this.updateCountCartEmit();
            }
          },
          error =>{
            loader.dismiss();
            this.toast('Ah ocurrido un error agregando el producto al carrito.');
            console.log(error);
          }
        ); 
      });
    });
  }
  
  openCart(){
    let loader = this.loadingController.create({
      content: "Cargando Carrito..."
    });
    loader.present();
    this.navCtrl.push( CartPage ).then(()=>{
      setTimeout(() => {
        loader.dismiss();
      },200);
    });
  }
  
  updateCountCartEmit(){
    let loader = this.loadingController.create({
      content: "Actualizando Carrito..."
    });
    loader.present();
    setTimeout(() => {
      this.storage.get('cart').then((val) => {
        this.updateCountCart.emit( val.quantity );
        loader.dismiss();
        this.toast('Agregado al carrito.');
        setTimeout(() => {
          this.updateFooter();
        },200);
      });
    },500);
  }
  
  updateFooter(){
    this.storage.get('cart').then((val) => {
      if(val != null && val != "null" && val != "" ){
        this.infoFooter.img = val.products[0].image_manufacturer;
        this.infoFooter.number = val.quantity;
        this.infoFooter.subtotal = val.format_order_total;
      }
      else {
        this.infoFooter.number = 0;
      }
    });
  }
  
  toast(msg){
    let toast = this.toastCtrl.create({
          message:  msg,
          duration: 1000,
          position: 'middle',
          cssClass: "toast"
        });
    toast.present();
  }
  
  ionViewWillEnter(){
    this.header.showProductChildPageBtn(true);
    this.storage.get('userData').then((val) => {
      this.showBuyBtn = (val.kick_out == 1) ? false : true;
    });
    this.analytics.trackView('ProductChildPage');
    if(!this.productMap){
      this.tabsService.hide();  
    }
    if(this.showMapProductPage){
      this.inizializateMap();
    }
    setTimeout(()=>{
      this.getInstagramImages();
      this.updateFooter();
    },500);
  }
  
  getInstagramImages(){
    this.instagramService.getInstagramData(this.manufacturer.m_id, 5).then(
      (data:any) => {
        this.instragramData = data.result;
        this.countInstagramData = Object.keys(this.instragramData).length;
      }
    );
  }

  openInstagram(profile:any) {
    let url = "http://instagram.com/"+profile;
    this.browserTab.isAvailable().then((
      isAvailable: boolean) => {
        if (isAvailable) {
          this.browserTab.openUrl(url);
        } else {
          this.iab.create(url, '_blank', 'location=yes');
          // open URL with InAppBrowser instead or SafariViewController
        }
      }
    );
  }
  
  openImageInstagram(url:any){
    this.browserTab.isAvailable().then(
      (isAvailable: boolean) => {
        if (isAvailable) {
          this.browserTab.openUrl(url);
        } else {
          this.iab.create(url, '_blank', 'location=yes');
          // open URL with InAppBrowser instead or SafariViewController
        }
      }
    );
  }
  
  ionViewWillLeave(){
    if(!this.productMap){
      this.tabsService.show();
    }
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
      streetViewControl: false,
      rotateControl: true,
      fullscreenControl: false,
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
    this.bonusService.getMapData(this.latitude, this.longitude, this.manufacturer.m_id, 2 ).then((data:any)=>{
      for(let pos of data.result){
        this.addMarker(pos.latitude, pos.longitude);
      }
    });
  }
  
  addMarker(lat: number, lng: number): void {
    let img = {
      url: 'assets/img/pointer.svg',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(10, 10)
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
}
