import { Component, EventEmitter, Output } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';
import { SearchModalPage } from '../search-modal/search-modal';
import { CartPage } from '../cart/cart';
import { SearchService } from '../../providers/search.service';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the Header page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-header',
  templateUrl: 'header.html',
  providers: [SearchService]
})
export class HeaderPage {
  
  public modalShow:any = false;
  public searchTerm: string = '';
  public items: any;
  
  public searchData:any;
  public backButtonShow:any = false;
  public countCart:any = 0;
  
  public limit:any;
  public total_search:any;
    
  @Output()
  public updateSearchData: EventEmitter<string> = new EventEmitter<string>();
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private searchService: SearchService, public viewCtrl: ViewController, public storage: Storage) {
    this.modalShow = navParams.get('modalShow') ? navParams.get('modalShow') : this.modalShow;
    this.backButtonShow = this.backButtonShow ? this.backButtonShow : false;
    this.storage.get('cart').then((val) => {
      if (val != null || val != undefined ){
        this.countCart = val.quantity;
      }
    });
  }
    
  search(){
    this.limit = 10; 
    this.total_search = 0; 
    setTimeout(() => {
      this.searchService.search( this.searchTerm, '1', this.limit, this.total_search ).then((data) => {
        this.searchData = data;
        this.updateSearchData.emit(this.searchData);
      });
    },500);
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
  
  updateCountCart( countCart:any ) {
    this.countCart = countCart;
//    console.log( this.countCart );
  }

}
