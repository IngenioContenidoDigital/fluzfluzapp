import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { Storage } from '@ionic/storage';
import { MyAccountService } from '../../providers/myAccount.service';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the Confirmated page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-confirmated',
  templateUrl: 'confirmated.html',
  providers: [MyAccountService]
})
export class ConfirmatedPage {
  
  public userData:any = {};
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public tabsService: TabsService, public storage: Storage, public myAccount: MyAccountService) {
  }

  ionViewWillEnter(){
    this.tabsService.hide();
    this.getUserData();
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }
  
  public goTo(){
    this.navCtrl.setRoot(TabsPage);
  }
  
  getUserData() {
    this.storage.get('userData').then((val) => {
      this.userData.userName = val.firstname;
      this.myAccount.getDataAccount(val.id).then(
        (data:any) => {
          this.userData = Object.assign(this.userData, JSON.parse(data));
          this.userData.fluzLasted === null ? this.userData.fluzLasted = 0 : this.userData.fluzLasted = this.userData.fluzLasted;
        }
      );
    });
  }
}
