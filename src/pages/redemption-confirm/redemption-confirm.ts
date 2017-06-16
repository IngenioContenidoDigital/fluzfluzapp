import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';

/**
 * Generated class for the RedemptionConfirmPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-redemption-confirm',
  templateUrl: 'redemption-confirm.html',
})
export class RedemptionConfirmPage {

  public disponibleFluz:any = {};
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public tabsService: TabsService) {
    this.disponibleFluz = navParams.get("disponibleFluz");
  }
  
  ionViewWillEnter(){
    this.tabsService.hide();
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }

}
