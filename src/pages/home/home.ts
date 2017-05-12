import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ConfirmPage } from '../confirm/confirm';
import { ConfirmatedPage } from '../confirmated/confirmated';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyAccountService } from '../../providers/myAccount.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MyAccountService]
})
export class HomePage {
  
  public userData:any = {};
  
  constructor(
    public navCtrl: NavController, public storage: Storage, public splashScreen: SplashScreen, public myAccount: MyAccountService
  ) {}
  
  public goToLogin() {
    this.navCtrl.push( LoginPage );
  }
  
  public goToConfirm() {
    this.navCtrl.push( ConfirmPage );
  }
    
  public goToConfirmated() {
    this.navCtrl.push( ConfirmatedPage );
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
      
      default: {
        this.navCtrl.pop();        
        break;
      }
      
    }
  }
   
  ionViewWillEnter(){
    this.splashScreen.hide();
    this.storage.get('userData').then((val) => {
      if ( val !== false ){
        if (val === null || val === undefined ){
          this.goTo("LoginPage");
        }
      }
    });
    this.getUserData();
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
