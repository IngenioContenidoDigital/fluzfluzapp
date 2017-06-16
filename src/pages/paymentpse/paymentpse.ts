import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { Banco } from '../../models/banco';
import { BancoService } from '../../providers/banco.service';

/**
 * Generated class for the Paymentpse page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-paymentpse',
  templateUrl: 'paymentpse.html',
  providers: [BancoService]
})
export class PaymentPsePage {
  
  public bancos:Banco[];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public tabsService: TabsService, private backService: BancoService) {
  }
  
  ionViewWillEnter(){
    this.tabsService.hide();
    this.getDataBank();
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }
  
  getDataBank(){
    this.backService.getBanks().then(bancos => this.bancos = bancos);
  }
}
