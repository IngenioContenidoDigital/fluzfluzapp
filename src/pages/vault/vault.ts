import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { VaultService } from '../../providers/vault.service';
import { BonusPage } from '../bonus/bonus';
import { HomePage } from '../home/home';

//import { PasscodePage } from '../passcode/passcode';

/**
 * Generated class for the Vault page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-vault',
  templateUrl: 'vault.html',
  providers: [VaultService]
})
export class VaultPage {
  
  public vaultData:any = [];
  public vaultOption = '';
  public item:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public vault: VaultService) {
    this.vaultOption = 'bonus';
  }

  ionViewWillEnter(){
    setTimeout(()=>{
      this.updateVault();
    }, 100);  
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
  
  openItem(item){
    this.item = item;
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.vault.getVaultData(val.id, this.item.id_manufacturer).then(
          (data:any) => {
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
      case "home": {
        this.navCtrl.pop( HomePage );
        break;
      }
      default: {
        this.navCtrl.pop();        
        break;
      }
    }
  }
}