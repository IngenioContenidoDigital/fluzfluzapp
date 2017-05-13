import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';

@Component({
  selector: 'page-search-modal',
  templateUrl: 'search-modal.html',
})
export class SearchModalPage {
  
  
  public searchData:any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController, public tabsService: TabsService) {
  }
  
  ionViewWillEnter(){
    this.tabsService.show();
  }
  
  closeModal() {
    this.viewCtrl.dismiss();
  }
  
  updateSearchData(searchData:string) {
    this.searchData = searchData; 
  }
  
  
  
}
