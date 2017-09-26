import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { CountryService } from '../../providers/country.service';
import { AnalyticsService } from '../../providers/analytics.service';

@Component({
  selector: 'page-country-modal',
  templateUrl: 'country-modal.html',
  providers: [
    CountryService,
    AnalyticsService
  ]
})
export class CountryModalPage {
  
  public countries:any;
  
  constructor(
    private countryService: CountryService,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public tabsService: TabsService,
    public analytics: AnalyticsService
  ) {
    
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('Country-ModalPage');
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