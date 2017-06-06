import { Component, EventEmitter, Output } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController, ViewController } from 'ionic-angular';
import { SearchModalPage } from '../search-modal/search-modal';
import { CartPage } from '../cart/cart';
import { SearchService } from '../../providers/search.service';
import { TabsPage } from '../tabs/tabs';


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
    
  @Output()
  public updateSearchData: EventEmitter<string> = new EventEmitter<string>();
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private searchService: SearchService, public viewCtrl: ViewController) {
    this.modalShow = navParams.get('modalShow') ? navParams.get('modalShow') : this.modalShow;
    this.backButtonShow = this.backButtonShow ? this.backButtonShow : false;
  }
  
  search(){
    this.searchService.search( this.searchTerm, '1' ).then((data) => {
      this.searchData = data;
      this.updateSearchData.emit(this.searchData);
    });
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

  
  
  
}
