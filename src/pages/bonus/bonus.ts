import { Component, trigger, style, animate, state, transition, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { TabsService } from '../../providers/tabs.service';
import { BonusService } from '../../providers/bonus.service';
import { SHOW_REFINE_BUTTONS } from '../../providers/config';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { GiftModalPage } from '../gift-modal/gift-modal';
import { VaultService } from '../../providers/vault.service';
import { AnalyticsService } from '../../providers/analytics.service';

declare var google;

@Component({
  selector: 'page-bonus',
  templateUrl: 'bonus.html',
  providers: [
    BonusService,
    Clipboard,
    VaultService,
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
export class BonusPage {
  // Maps
  @ViewChild('map') mapElement: ElementRef;
  public map: any;
  public markers: any = [];
  public ubication:any = '';
  public latitude:any;
  public longitude:any;
  
  public manufacturer:any;
  public directions:any = [];
  public bonus:any = [];
  public bonusT:any;
  public showDetails:any;
  public status:any;
  public showRefine:any = SHOW_REFINE_BUTTONS;
  
  constructor( 
    private alertCtrl: AlertController,
    private clipboard: Clipboard,
    public modalCtrl: ModalController,
    public storage: Storage,
    public toastCtrl: ToastController,
    public loadingController: LoadingController,
    public bonusService: BonusService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public tabsService: TabsService,
    public geolocation: Geolocation,
    public vault: VaultService,
    public analytics: AnalyticsService
  ){
    this.manufacturer = navParams.get("manufacturer");
    this.bonus = navParams.get("bonus");
    this.bonus.showDetails = true;
    this.bonusT = navParams.get("bonusT");
  }
  
  toggleDetails(data) {
    this.showDetails = ( this.showDetails != data.id_product_code ) ? data.id_product_code : false ;
  }
  
  toggleDescription(data, option){
    switch (option){
      case "1": {
        data.showDescription = data.showDescription ? false : true ;
        break;
      }
      case "2": {
        data.showDirections = data.showDirections ? false : true ;
        setTimeout(()=>{ 
          if(data.showDirections){
//            this.inizializateMap();
            this.getDirections();
          } 
        }, 200 );
        break;
      }
      case "3": {
        data.showTerms = data.showTerms ? false : true ;
        break;
      }
      default: {
        break;
      }
    }
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('BonusPage');
    this.tabsService.hide();
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }
  
  saveStatusBonus(item:any, used:any){
    if(used == 1){
      let alert = this.alertCtrl.create({
        title: 'Actualizar',
        message: 'Por favor ingresa la cantidad usada:',
        inputs: [
          {
            name: 'price_card_used',
            placeholder: '$',
            type: 'number'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Aceptar',
            handler: (data) => {
              this.updateBonus( item.id_product_code, used, data.price_card_used );
            }
          }
        ]
      });
      alert.present();
    }
    else {
      let teminator = this.alertCtrl.create({
        title: 'Actualizar',
        message: 'Seguro quieres marcar como terminado este bono?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Aceptar',
            handler: (data) => {
              this.updateBonus( item.id_product_code, used );
            }
          }
        ]
      });
      teminator.present();
      
    }
  }
  
  updateBonus( card:any, used:any, value:any = 0){
    let loader = this.loadingController.create({
      content: "Enviando..."
    });
    loader.present();
    this.bonusService.updateBonus( card, used, value ).then(
      (data:any) => {
        let rData = JSON.parse(data);
        for(let x of this.bonus){
          if ( x.id_product_code == rData.id_product_code) {
            x.used = rData.used;
            loader.dismiss();
          }
        }
      }
    )
    .catch(function () {
      console.log("Error");
    });
  }
  
  copyToClipboard(code:any) {
    let toast = this.toastCtrl.create({
          message:  'Copiado.',
          duration: 1000,
          position: 'middle',
          cssClass: "toast"
        });
    this.clipboard.copy(code);
    toast.present();
  }
  
  getDirections(){
    this.bonusService.getAddressManufacturer(this.manufacturer.id_manufacturer).then(
      (data:any)=>{
        this.directions = data.result;
      }
    )
    .catch(function () {
      console.log("Error");
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
    })
    .catch(function () {
      console.log("Error");
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
    this.bonusService.getMapData(this.latitude, this.longitude, this.manufacturer.id_manufacturer, 2 ).then((data:any)=>{
      for(let pos of data.result){
        this.addMarker(pos.latitude, pos.longitude);
      }
    })
    .catch(function () {
      console.log("Error");
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
  
  openModalGift(item:any){
    let giftModal = this.modalCtrl.create( GiftModalPage, { bonus: item } );
    giftModal.onDidDismiss(
      (data:any) => {
        let loader = this.loadingController.create({
          content: "Cargando..."
        });
        loader.present();
        this.storage.get('userData').then(
          (val) => {
            if( val != null && val != '' && val != undefined ){
              this.vault.getVaultData(val.id, this.bonus['0'].id_manufacturer).then(
                (data:any) => {
                  loader.dismiss();
                  this.bonus = data.result;
                  this.bonusT = data.total;
                }
              );
            }
          }
        )
        .catch(function () {
          console.log("Error");
        });
      }
    );
    giftModal.present();
  }
}
