import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { AnalyticsService } from '../../providers/analytics.service';

@Component({
  selector: 'page-redemption-confirm',
  templateUrl: 'redemption-confirm.html',
  providers: [
    AnalyticsService
  ]
})
export class RedemptionConfirmPage {

  public disponibleFluz:any = {};
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public tabsService: TabsService,
    public analytics: AnalyticsService
  ){
    this.disponibleFluz = navParams.get("disponibleFluz");
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('RedemptionConfirmPage');
    this.tabsService.hide();
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }

}
