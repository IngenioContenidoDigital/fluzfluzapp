import { Component, EventEmitter, Output, Renderer, ElementRef } from '@angular/core';
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
  public updateSearchResults = new EventEmitter();
  
  @Output()
  public showBackButton: EventEmitter<string> = new EventEmitter<string>();
  
  public searchResult:any = [];
  public searchTotal:any;
  public countSearchResult:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController, public tabsService: TabsService, /*public keyboard: Keyboard,*/ private renderer: Renderer, private elementRef: ElementRef) {
  }
  
  ionViewWillEnter(){
    this.tabsService.show();
  }
  
  ionViewDidLoad() {
    this.searchResult = [];
    setTimeout(() => {
      /*this.keyboard.show();*/
      let element = this.elementRef.nativeElement.querySelector('input');
      this.renderer.invokeElementMethod(element, 'focus', []);
    },150);
  }

  
  closeModal() {
    this.viewCtrl.dismiss();
  }
  
  updateSearchData( searchData:any ) {
    this.searchResult = searchData.result;
    this.searchTotal = searchData.total;
  }
  
  openItem(item:any) {
    this.showBackButton.emit(this.backButtom);
    this.navCtrl.push(ProductFatherPage,{
      manufacturer: item
    });
  }
  
  seeMoreResults(event) {
    this.countSearchResult = Object.keys( this.searchResult ).length;
    this.updateSearchResults.emit( this.countSearchResult );
  }
  
  updateSeeMoreSearchData( searchData:any ){
    this.searchTotal = searchData.total;
    var data = searchData.result;
    for (let i in data) {
      this.searchResult.push(data[i]);
    }
  }
}