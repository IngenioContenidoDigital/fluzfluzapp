import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ConfirmPage } from '../confirm/confirm';
import { ConfirmatedPage } from '../confirmated/confirmated';


/**
 * Generated class for the More page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
})
export class MorePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad More');
  }
  
  goTo(value:any) {
    
    switch (value){
      
      case "ConfirmPage": {
        this.navCtrl.push( ConfirmPage );
        break;
      }
      
      case "LoginPage": {
        this.navCtrl.push( LoginPage );
        break;
      }
      
      case "ConfirmatedPage": {
        this.navCtrl.push( ConfirmatedPage );
        break;
      }
      
      default: {
        this.navCtrl.pop();        
        break;
      }
      
    }
  }
  
}
