import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, Platform } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, MarkerOptions, Marker, MarkerIcon } from '@ionic-native/google-maps';
import { MapService } from '../../providers/map.service';
import { ProductModalPage } from '../product-modal/product-modal';
import { SearchService } from '../../providers/search.service';
import { AnalyticsService } from '../../providers/analytics.service';
import { TabsService } from '../../providers/tabs.service';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [
    SearchService,
    GoogleMaps,
    MapService,
    AnalyticsService
  ],
})
export class MapPage {
  public map: GoogleMap;
  
  constructor( 
    public platform: Platform,
    public modalCtrl: ModalController,
    private searchService: SearchService,
    public loadingController: LoadingController,
    public maps: MapService,
    public tabsService: TabsService,
    public googleMaps: GoogleMaps,
    public geolocation: Geolocation,
    public navCtrl: NavController,
    public navParams: NavParams,
    public analytics: AnalyticsService
  ) {
  }

  ionViewWillEnter(){
    this.analytics.trackView('MapPage');
//    this.tabsService.show();
  }
  
  ionViewDidLoad() {
     setTimeout(()=>{
       this.getPosition();
     }, 500);
  } 
    
  getPosition():any {
    let loader = this.loadingController.create({
      content: "Obteniendo posición..."
    });
    loader.present();
    this.geolocation.getCurrentPosition({timeout:15000}).then(response => {
      this.platform.ready().then(() => {
        setTimeout(()=>{
          loader.dismiss();
          this.loadMap(response);
        }, 1000);
      })
      .catch(error =>{
        console.log(error);
      });
    })
    .catch(error =>{
      console.log(error);
    })
  }
  
  loadMap(postion: Geoposition){
    let loader = this.loadingController.create({
      content: "Cargando Mapa..."
    });
    loader.present();
    setTimeout(()=>{
      loader.dismiss();
    }, 1000);
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
    
    this.map = this.googleMaps.create(element, mapOptions);
    setTimeout(() => {
      this.map.setClickable(true);
    }, 100);
    // create LatLng object
    let myPosition: LatLng = new LatLng(latitude,longitud);

    // create CameraPosition
    let position = {
      target: myPosition,
      zoom: 18,
      tilt: 30
    };
    this.map.one(GoogleMapsEvent.MAP_READY).then(()=>{
      // move the map's camera to position
      this.map.moveCamera(position);
      // Obtiene las ubicaciones de los comercios
      this.getLocations(latitude, longitud);
    })
    .catch(error =>{
      console.log(error);
    });
  }
  
  getLocations(latitude:any, longitud:any ){
    this.maps.getMapData(latitude, longitud, 1).then((data:any)=>{
      for(let pos of data.result){
        let position: LatLng = new LatLng(pos.latitude,pos.longitude);
        // Genera un marcador en el mapa.
        this.setMarker(position);
      }
    })
    .catch(error =>{
      console.log(error);
    });
  }

  setMarker(position:any){
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
    this.map.addMarker(markerOptions).then((marker: Marker)=>{
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
          let productModal = this.modalCtrl.create( ProductModalPage, { productMap: data, result: data.result } );
          this.map.setClickable(false);
          productModal.onDidDismiss(data => {
            this.map.setClickable(true);
          });
          productModal.present();
        })
        .catch(error =>{
          console.log(error);
        });
      });
    })
    .catch(error =>{
      console.log(error);
    });
  }
}
