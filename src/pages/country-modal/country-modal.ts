import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { CountryService } from '../../providers/country.service';

@Component({
  selector: 'page-country-modal',
  templateUrl: 'country-modal.html',
  providers: [CountryService]
})
export class CountryModalPage {
  
  public countries:any;
  
  constructor(public viewCtrl: ViewController, private countryService: CountryService, public navCtrl: NavController, public navParams: NavParams, public tabsService: TabsService ) {
    
  }
  
  ionViewWillEnter(){
    this.tabsService.hide();
    this.getDataCountry();
  }
  
  ionViewDidLoad() {
    this.tabsService.show();
  }
  
  getDataCountry(){
    this.countryService.getCountries().then( 
      (countries:any) => {
        this.countries = JSON.parse(countries);
      }
    );
  }
  
  dismiss( item:any, cod:any ) {
    this.viewCtrl.dismiss({
      name: item.name,
      flag: item.flag,
      callingCodes: cod
    });
  }
}