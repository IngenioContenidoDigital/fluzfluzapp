import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MyAccountService } from '../../providers/myAccount.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-profile-modal',
  templateUrl: 'profile-modal.html',
  providers: [MyAccountService]
})
export class ProfileModalPage {
  public customer:any = [];
  public invitated:any = [];
  public data:any;
  public showInvitation:any;
  
  constructor(  public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public myAccount: MyAccountService ) {
    this.data = navParams.get('customer');
  }

  ionViewWillEnter(){
    console.log('this.data');
    console.log(this.data);
    this.storage.get('userData').then((val) => {
      this.myAccount.getProfile( val.id, this.data.id ).then(
        (data:any)=>{
          this.customer = JSON.parse(data);
          console.log('this.customer');
          console.log(this.customer);
        }
      );
    });
    setTimeout(()=>{
      this.myAccount.getInviteduserForProfile( this.data.id ).then(
        (data:any)=>{
          this.invitated = JSON.parse(data);
          console.log('getInviteduserForProfile');
          console.log(this.invitated);
        }
      );
    }, 500);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileModalPage');
  }
  
  

}
