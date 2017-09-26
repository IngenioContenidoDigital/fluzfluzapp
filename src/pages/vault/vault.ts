import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { VaultService } from '../../providers/vault.service';
import { BonusPage } from '../bonus/bonus';
import { TabsPage } from '../tabs/tabs';
import { TabsService } from '../../providers/tabs.service';
import { SHOW_REFINE_BUTTONS } from '../../providers/config';
import { AnalyticsService } from '../../providers/analytics.service';
//import { PasscodePage } from '../passcode/passcode';

@Component({
  selector: 'page-vault',
  templateUrl: 'vault.html',
  providers: [
    VaultService,
    AnalyticsService
  ]
})
export class VaultPage {
  
  public vaultData:any = [];
  public historyData:any = [];
  public vaultOption = '';
  public item:any;
  public showRefine:any = SHOW_REFINE_BUTTONS;  
  
  constructor(
    public loadingController: LoadingController,
    public tabsService: TabsService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public vault: VaultService,
    private viewCtrl: ViewController,
    public analytics: AnalyticsService
  ){
    this.vaultOption = 'bonus';
  }

  ionViewWillEnter(){
    this.updateHistory();
    this.analytics.trackView('VaultPage');
    setTimeout(()=>{
      this.updateVault();
    }, 100);  
    this.tabsService.hide();
    this.viewCtrl.showBackButton(false);
  }
  
  ionViewWillLeave(){
    this.tabsService.show();
  }

  updateVault(){
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.vault.getVaultData(val.id).then(
          (data:any) => {
            this.vaultData = data.result;
          }
        );
      }
    });
  }
  
  updateHistory(){
    this.storage.get('userData').then(
      (val) => {
        this.vault.getOrderHistory(val.id).then(
          (data:any) => {
            this.historyData = data.result;
            console.log('this.historyData');
            console.log(this.historyData);
          }
        );
      }
    );
  }
  
  openItem(item){
    let loader = this.loadingController.create({
      content: "Cargando..."
    });
    loader.present();
    this.item = item;
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.vault.getVaultData(val.id, this.item.id_manufacturer).then(
          (data:any) => {
            loader.dismiss();
            this.navCtrl.push( BonusPage,{
              manufacturer: this.item,
              bonus: data.result,
              bonusT: data.total
            });
          }
        );
      }
    });
  }
  
  goTo(value){
    switch (value){
      case "HomePage": {
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