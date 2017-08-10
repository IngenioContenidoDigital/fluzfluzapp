import { Component, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { ProductFatherPage } from '../product-father/product-father';
import { SHOW_REFINE_BUTTONS } from '../../providers/config';

@Component({
  selector: 'page-search-modal',
  templateUrl: 'search-modal.html',
})
export class SearchModalPage {
  
  public backButtom:any = true;
    
  @Output()
  public showBackButton: EventEmitter<string> = new EventEmitter<string>();
  
  public searchResult:any = [];
  public searchTotal:any;
  public countSearchResult:any;
  public enableSeeMoreResults:any = false;
  public noResults:any = [];
  public showRefine:any = SHOW_REFINE_BUTTONS;  
    
  @ViewChild('header') header;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController, public tabsService: TabsService, /*public keyboard: Keyboard,*/ private renderer: Renderer, private elementRef: ElementRef) {
    this.countSearchResult = 0;
    this.noResults.value = true;
  }
  
  ionViewWillEnter(){
    this.tabsService.show();
  }
  
  ionViewDidLoad() {
    this.searchResult = [];
    setTimeout(() => {
      let element = this.elementRef.nativeElement.querySelector('input');
      this.renderer.invokeElementMethod(element, 'focus', []);
    },150);
  }

  
  closeModal() {
    this.viewCtrl.dismiss();
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  updateSearchData( searchData:any ) {
    this.searchResult = searchData.result;
    this.searchTotal = searchData.total;
    setTimeout(() => { this.enableSeeMoreButtom(); },150);
  }
  
  openItem(item:any) {
    this.showBackButton.emit(this.backButtom);
    this.navCtrl.push(ProductFatherPage,{
      manufacturer: item
    });
  }
  
  seeMoreResults(event:any) {
    this.countSearchResult = Object.keys( this.searchResult ).length; // Ultimo total de búsqueda
    this.header.updateLastTotalSearch(this.countSearchResult);
  }
  
  updateSeeMoreSearchData( searchData:any ){
    this.searchTotal = searchData.total;
    var data = searchData.result;
    for (let i in data) {
      this.searchResult.push(data[i]);
    }
    setTimeout(() => { this.enableSeeMoreButtom(); },150);
  }
    
  enableSeeMoreButtom(){
    if(this.searchResult){
      this.enableSeeMoreResults = ( Object.keys(this.searchResult).length == this.searchTotal ) ? false : true;
      this.noResults.value = false;
    }
    else {
      this.noResults.value = true;
      this.noResults.text = 'No se han encontrado resultados.';
    }
  }
}