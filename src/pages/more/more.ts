import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { TransferFluzPage } from '../transferfluz/transferfluz';
import { PersonalInformationPage } from '../personalinformation/personalinformation';
import { MessagesPage } from '../messages/messages';
import { ConfirmPage } from '../confirm/confirm';
import { ConfirmatedPage } from '../confirmated/confirmated';
import { MyAccountService } from '../../providers/myAccount.service';
import { MessagesService } from '../../providers/messages.service';
import { Storage } from '@ionic/storage';
import { LoginService } from '../../providers/login-service';
import { SHOW_MORE_OPTIONS } from '../../providers/config';
import { SHOW_SAVINGS } from '../../providers/config';
import { SHOW_LASTED_FLUZ } from '../../providers/config';
import { RedemptionPage } from '../redemption/redemption';

/**
 * Generated class for the More page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
  providers: [MyAccountService,LoginService,MessagesService]
})
export class MorePage {

  public userData:any = {};
  public showOptions:any = SHOW_MORE_OPTIONS;
  public showSavings:any = SHOW_SAVINGS;
  public lastedFluz:any = SHOW_LASTED_FLUZ;
  
  constructor( public loadingController: LoadingController, public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public myAccount: MyAccountService, private loginService:LoginService, public messagesService: MessagesService) {
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
    let loader = this.loadingController.create({
      content: "Cerrando sesión..."
    });
    loader.present();
    this.loginService.logout().then(
      (data:boolean) => {
        loader.dismiss();
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
      
      case "TransferFluzPage": {
        this.navCtrl.push( TransferFluzPage );
        break;
      }
      
      case "PersonalInformationPage": {
        this.navCtrl.push( PersonalInformationPage, {customer: this.userData} );
        break;
      }
      
      case "MessagesPage": {
        this.navCtrl.push( MessagesPage );
        break;
      }
      
      case "RedemptionPage": {
        this.navCtrl.push( RedemptionPage );
        break;
      }
      
      default: {
        this.navCtrl.pop();        
        break;
      }
      
    }
  }
  
}
