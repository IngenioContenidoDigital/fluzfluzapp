import { Component, trigger, style, animate, state, transition  } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { MyAccountService } from '../../providers/myAccount.service';
import { TransferFluzService } from '../../providers/transferfluz.service';
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the TransferFluzConfirm page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-transferfluz-confirm',
  templateUrl: 'transferfluz-confirm.html',
  providers: [ MyAccountService,TransferFluzService ],
  animations: [
    trigger('slideIn', [
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition('* => void', [
          style({ height: '*' }),
          animate(250, style({ height: 0 }))
      ]),
      transition('void => *', [
          style({ height: '0' }),
          animate(250, style({ height: '*' }))
      ])
    ])
  ]
})
export class TransferFluzConfirmPage {
    
    public data:any = [];
  
    constructor(public loadingController: LoadingController, public navCtrl: NavController, public navParams: NavParams, public tabsService: TabsService, public storage: Storage, public myAccount: MyAccountService, public transferFluz: TransferFluzService, private alertCtrl: AlertController) {
        this.data = navParams.get("data");
    }
    
    ionViewWillEnter(){
        this.tabsService.hide();
    }

    ionViewWillLeave(){
        this.tabsService.show();
    }
    
    goToHome() {
        this.tabsService.changeTabInContainerPage(0);
        this.navCtrl.setRoot(TabsPage);
    }
}
