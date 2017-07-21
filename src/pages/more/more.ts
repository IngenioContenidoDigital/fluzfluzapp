import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ConfirmPage } from '../confirm/confirm';
import { ConfirmatedPage } from '../confirmated/confirmated';
import { MyAccountService } from '../../providers/myAccount.service';
import { Storage } from '@ionic/storage';
import { LoginService } from '../../providers/login-service';
import { SHOW_MORE_OPTIONS } from '../../providers/config';
import { SHOW_SAVINGS } from '../../providers/config';
import { SHOW_LASTED_FLUZ } from '../../providers/config';

/**
 * Generated class for the More page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
  providers: [MyAccountService,LoginService]
})
export class MorePage {

  public userData:any = {};
  public showOptions:any = SHOW_MORE_OPTIONS;
  public showSavings:any = SHOW_SAVINGS;
  public lastedFluz:any = SHOW_LASTED_FLUZ;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public myAccount: MyAccountService, private loginService:LoginService) {
  }

  ionViewWillEnter(){
    this.getUserData();
  }
  
  getUserData() {
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.userData.userName = val.firstname;
        this.myAccount.getDataAccount(val.id).then(
          (data:any) => {
//            console.log(data);
            this.userData = Object.assign(this.userData, JSON.parse(data));
            this.userData.fluzLasted === null ? this.userData.fluzLasted = 0 : this.userData.fluzLasted = this.userData.fluzLasted;
          }
        );
      }
    });
  }
  
  logout(){
    this.loginService.logout().then(
      (data:boolean) => {
        if ( data ){
          this.storage.set('userData', false);          
        }
      }
    );
    setTimeout(()=>{ this.goTo('LoginPage') }, 100);
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
