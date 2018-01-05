import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { AnalyticsService } from '../../providers/analytics.service';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
  providers: [
    AnalyticsService
  ]
})
export class TutorialPage {

  constructor(
    public tabsService: TabsService,
    public analytics: AnalyticsService,
    public navCtrl: NavController,
    public storage: Storage,
    public navParams: NavParams
  ) {
  }

  ionViewWillEnter(){
    this.analytics.trackView('TutorialPage');
    this.tabsService.hide();
  }
  
  goTo(value){
    switch (value){
      case "HomePage": {
        this.storage.set('tutorial', true);
        this.tabsService.changeTabInContainerPage(0);
        this.navCtrl.setRoot(TabsPage);
        break;
      }
      default: {
        this.navCtrl.pop();        
        break;
      }
    }
  }

}
