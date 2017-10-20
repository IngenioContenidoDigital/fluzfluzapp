import { Component, EventEmitter, Output, Input, Renderer, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController, ViewController, LoadingController } from 'ionic-angular';
import { SearchModalPage } from '../search-modal/search-modal';
import { CartPage } from '../cart/cart';
import { SearchService } from '../../providers/search.service';
//import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

/**
 * Generated class for the Header page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-header',
  templateUrl: 'header.html',
  providers: [SearchService],
})
export class HeaderPage {
  
  public modalShow:any = false;
  public searchTerm: string = '';
  public items: any;
  
  public searchData:any;
  public backButtonShow:any = false;
  
  @Output()
  public updateSearchData: EventEmitter<string> = new EventEmitter<string>();
  
  @Output()
  public updateSeeMoreSearchData: EventEmitter<string> = new EventEmitter<string>();
  
  @Input('lastTotalSearch') lastTotalSearch:number;
  
  @ViewChild('input') myInput;
  
  public countCart:any = 0;
  
  constructor( public loadingController: LoadingController, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private searchService: SearchService, public viewCtrl: ViewController, public storage: Storage, private renderer: Renderer, private elementRef: ElementRef) {
    this.modalShow = navParams.get('modalShow') ? navParams.get('modalShow') : this.modalShow;
    this.backButtonShow = this.backButtonShow ? this.backButtonShow : false
    IntervalObservable.create(500).subscribe( n => {
      this.storage.get('cart').then((val) => {
        if (val != null || val != undefined ){
          this.countCart = val.quantity;
        }
      });      
    });
  }
    
  search( limit:any = 10, lastTotal:any = 0, seeMore:any = false ){
//    this.myInput.setFocus();
    let loader = this.loadingController.create({
      content: "Buscando..."
    });
//    this.myInput.setFocus();
    loader.present();
    setTimeout(() => {
      this.searchService.search( this.searchTerm, '1', limit, lastTotal ).then((data) => {
        this.searchData = data;
        loader.dismiss();
        this.myInput.setFocus();
        if ( seeMore === true ){
          this.updateSeeMoreSearchData.emit( this.searchData );
        }
        else {
          this.updateSearchData.emit( this.searchData );
        }
      });
    },100);
  }
  
  showBackButton(value:any){
    this.backButtonShow = value;
  }
  
  goTo(value:any){
    if( value === "CartPage" ){
      this.navCtrl.push( CartPage );
    }
    else if ( value === "Back"){
      this.navCtrl.pop();
      this.viewCtrl.dismiss();
    }
    else {
      this.viewCtrl.dismiss();
//      this.navCtrl.pop();
//      this.viewCtrl.dismiss();
//      this.navCtrl.popToRoot();
//      this.navCtrl.setRoot(TabsPage);
    }
  }
  
  openModalSearch(){
    if ( this.modalShow === false ){
      this.modalShow = true;
      let searchModal = this.modalCtrl.create( SearchModalPage, { modalShow: true } );
      searchModal.onDidDismiss(data => {
        this.showBackButton(false);
        this.modalShow = false;
      });
      searchModal.present();
    }
  }
  
  updateLastTotalSearch(value:any){
    this.search( ( 10 + value ), value, true );
  }
}
