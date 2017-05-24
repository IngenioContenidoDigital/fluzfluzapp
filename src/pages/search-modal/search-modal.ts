import { Component, EventEmitter, Output } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { ProductFatherPage } from '../product-father/product-father';

@Component({
  selector: 'page-search-modal',
  templateUrl: 'search-modal.html',
})
export class SearchModalPage {
  
  public backButtom:any = true;
  
  @Output()
  public showBackButton: EventEmitter<string> = new EventEmitter<string>();
  
  public searchResult:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController, public tabsService: TabsService) {
  }
  
  ionViewWillEnter(){
    this.tabsService.show();
  }
  
  closeModal() {
    this.viewCtrl.dismiss();
  }
  
  updateSearchData(searchData:any) {
    this.searchResult = searchData;
    console.log(this.searchResult);
  }
  
  openItem(item:any) {
    this.showBackButton.emit(this.backButtom);
    this.navCtrl.push(ProductFatherPage,{
      manufacturer: item
    });
  }
  
  
  
}
