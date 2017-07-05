import { Component, EventEmitter, Output, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';
import { SearchModalPage } from '../search-modal/search-modal';
import { CartPage } from '../cart/cart';
import { SearchService } from '../../providers/search.service';
import { TabsPage } from '../tabs/tabs';
import { ProductChildPage } from '../product-child/product-child';
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
  providers: [SearchService,ProductChildPage],
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
  
  @Input()
  public countCart:any = 0;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private searchService: SearchService, public viewCtrl: ViewController, public storage: Storage) {
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
    setTimeout(() => {
      this.searchService.search( this.searchTerm, '1', limit, lastTotal ).then((data) => {
        this.searchData = data;
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
    }
    else {
      this.navCtrl.setRoot(TabsPage);
    }
  }
  
  openModalSearch(){
    if ( this.modalShow === false ){
      this.modalShow = true;
      let searchModal = this.modalCtrl.create( SearchModalPage, { modalShow: true } );
      searchModal.present();
    }
  }
  
  updateCountCart(countCart) {
    this.countCart = countCart;
  }
  
  updateSearchResults(lastTotal) {
    this.search( ( 10 + lastTotal ), lastTotal, true );
  }
}
