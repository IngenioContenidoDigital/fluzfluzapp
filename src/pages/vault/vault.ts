import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { VaultService } from '../../providers/vault.service';
import { BonusPage } from '../bonus/bonus';
import { VoucherModalPage } from '../voucher-modal/voucher-modal';
import { TabsPage } from '../tabs/tabs';
import { TabsService } from '../../providers/tabs.service';
import { SHOW_REFINE_BUTTONS } from '../../providers/config';
import { AnalyticsService } from '../../providers/analytics.service';

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
    public modalCtrl: ModalController,
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
        )
        .catch(error =>{
          console.log(error);
        });
      }
    })
    .catch(error =>{
      console.log(error);
    });
  }
  
  updateHistory(){
    this.storage.get('userData').then(
      (val) => {
        this.vault.getOrderHistory(val.id).then(
          (data:any) => {
            this.historyData = data.result;
          }
        )
        .catch(error =>{
          console.log(error);
        });
      }
    )
    .catch(error =>{
      console.log(error);
    });
  }
  
  openItem(item){
    let loader = this.loadingController.create({
      content: "Cargando..."
    });
    loader.present();
    this.item = item;
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        console.log('val.id');
        console.log(val.id);
        console.log('this.item');
        console.log(this.item);
        this.vault.getVaultData(val.id, this.item.id_manufacturer).then(
          (data:any) => {
            console.log('data');
            console.log(data);
            loader.dismiss();
            this.navCtrl.push( BonusPage,{
              manufacturer: this.item,
              bonus: data.result,
              bonusT: data.total
            });
          }
        )
        .catch(error =>{
          console.log(error);
        });
      }
    })
    .catch(error =>{
      console.log(error);
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
  
  openOrderHistory(order:any){
    let modal = this.modalCtrl.create( VoucherModalPage, { order: order } );
    modal.present();
  }
  
}