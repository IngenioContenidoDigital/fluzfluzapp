import { Component, trigger, style, animate, state, transition  } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NetworkService } from '../../providers/network.service';
import { Storage } from '@ionic/storage';
import { MyAccountService } from '../../providers/myAccount.service';

/**
 * Generated class for the Network page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-network',
  templateUrl: 'network.html',
  providers: [NetworkService, MyAccountService],
  animations: [
    trigger('slideIn', [
      state('*', style({ 'overflow-y': 'hidden' })),
      state('void', style({ 'overflow-y': 'hidden' })),
      transition('* => void', [
          style({ height: '*' }),
          animate(250, style({ height: 0 }))
      ]),
      transition('void => *', [
          style({ height: '0' }),
          animate(250, style({ height: '*' }))
      ])
    ])
  ]
})
export class NetworkPage {
  
  public activityNetwork:any = {};
  public showHomeUserData:any = false;
  public userData:any = {};
  public seeMoreValue:any = 5;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public network: NetworkService, public storage: Storage, public myAccount: MyAccountService) {
  }
  
  ionViewWillEnter(){
    this.storage.get('userData').then((val) => {
      if (val === null || val === undefined || val == false){
        this.updateShowDataUser(false);
      }
      else {
        this.updateShowDataUser(true);
      }
    });
    this.getUserData();
    this.getNetworData( this.seeMoreValue );
  }
  
  ionViewWillLeave(){
    this.seeMoreValue = this.seeMoreValue != 5 ? 5 : this.seeMoreValue ;
  }
  
  updateShowDataUser(value:any){
    this.showHomeUserData = value;
  }
  
  getUserData() {
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.userData.userName = val.firstname;
        this.myAccount.getDataAccount(val.id).then(
          (data:any) => {
            this.userData = Object.assign(this.userData, JSON.parse(data));
            this.userData.fluzLasted === null ? this.userData.fluzLasted = 0 : this.userData.fluzLasted = this.userData.fluzLasted;
          }
        );
      }
    });
  }
  
  getNetworData( limit:any ) {
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.network.getDataAccount(val.id, limit).then(
          (data:any) => {
            this.activityNetwork = JSON.parse(data);
            console.log(this.activityNetwork.result);
          }
        );
      }
    });
  }
  
  seeMore(){
    this.seeMoreValue += 5;
    this.getNetworData( this.seeMoreValue );
  }

}
