import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PasscodePage } from '../passcode/passcode';

/**
 * Generated class for the Vault page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-vault',
  templateUrl: 'vault.html',
})
export class VaultPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.navCtrl.push( PasscodePage );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Vault');
  }

}
