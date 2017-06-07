import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Bonus page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-bonus',
  templateUrl: 'bonus.html',
})
export class BonusPage {

  public manufacturer:any;
  public bonus:any;
  public bonusT:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.manufacturer = navParams.get("manufacturer");
    this.bonus = navParams.get("bonus");
    this.bonusT = navParams.get("bonusT");
    console.log('Este es el que llega:');
    console.log(this.manufacturer);
    console.log(this.bonus);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Bonus');
  }

}
