import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchService } from '../../providers/search.service';
import { CartService } from '../../providers/cart.service';
import { Storage } from '@ionic/storage';
import { TabsService } from '../../providers/tabs.service';
import { SHOW_SAVINGS } from '../../providers/config';
import { SHOW_MAP_PRODUCT_PAGE } from '../../providers/config';
import { BonusService } from '../../providers/bonus.service';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'page-product-child',
  templateUrl: 'product-child.html',
  providers: [BonusService, SearchService, CartService]
})
export class ProductChildPage {
  // Maps
  @ViewChild('map') mapElement: ElementRef;
  public map: any;
  public markers: any = [];
  public ubication:any = '';
  public latitude:any;
  public longitude:any;
  
  public manufacturer:any = {};
  public productFather:any = {};
  public productChild:any = {};
  public intructions:any = '';
  public terms:any = '';
  public inform:any;
  public idCart:any = 0;
  public showSavings = SHOW_SAVINGS;
  public showMapProductPage = SHOW_MAP_PRODUCT_PAGE;
  
  @Output('updateCountCart')
  public updateCountCart: EventEmitter<number> = new EventEmitter<number>();
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public searchService: SearchService, public cartService: CartService, public storage: Storage, public tabsService: TabsService, public geolocation: Geolocation, public bonusService: BonusService) {
    this.inform = "instructions";
    this.manufacturer = navParams.get("manufacturer");
    this.productFather = navParams.get("productFather");
    this.searchService.search( this.productFather.id_parent, '3' ).then((data) => {
      this.productChild = data;
      this.intructions = this.productChild.result['0'].instructions;
      this.terms = this.productChild.result['0'].terms;
    });
  }

  addToCart(idProduct:any){
    this.storage.get('cart').then((val) => {
      this.idCart = ( val != undefined && val != null && val != '' ) ? val.id : 0;
      this.cartService.addToCart( this.idCart, idProduct).subscribe(
        success => {
          if(success.status === 200) {
            this.storage.set('cart', JSON.parse(success._body));
            this.updateCountCartEmit();
          }
        },
        error =>{
          console.log(error)
        }
      ); 
    });
  }
  
  updateCountCartEmit(){
    setTimeout(() => {
      this.storage.get('cart').then((val) => {
        this.updateCountCart.emit( val.quantity );
      });
    },500);
  }
  
  ionViewWillEnter(){
    this.tabsService.hide();
    this.inizializateMap();
  }

  ionViewWillLeave(){
    this.tabsService.show();
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
