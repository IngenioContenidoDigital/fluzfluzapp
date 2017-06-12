import { Component, EventEmitter, Output, ViewChild, Renderer, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { ProductFatherPage } from '../product-father/product-father';
import { Keyboard } from '@ionic-native/keyboard';


@Component({
  selector: 'page-search-modal',
  templateUrl: 'search-modal.html',
  providers: [ Keyboard ]
})
export class SearchModalPage {
  
  public backButtom:any = true;
  
  @Output()
  public showBackButton: EventEmitter<string> = new EventEmitter<string>();
  
  public searchResult:any = {};

  @ViewChild('input') myInput ;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController, public tabsService: TabsService, private keyboard: Keyboard, private renderer: Renderer, private elementRef: ElementRef) {
  }
  
  ionViewWillEnter(){
    this.tabsService.show();
  }
  
  ionViewDidLoad() {
    setTimeout(() => {
      this.keyboard.show();
      let element = this.elementRef.nativeElement.querySelector('input');
      this.renderer.invokeElementMethod(element, 'focus', []);
    },150);
  }

  
  closeModal() {
    this.viewCtrl.dismiss();
  }
  
  updateSearchData(searchData:any) {
    this.searchResult = searchData;
  }
  
  openItem(item:any) {
    this.showBackButton.emit(this.backButtom);
    this.navCtrl.push(ProductFatherPage,{
      manufacturer: item
    });
  }
  
}
