import { Component, trigger, style, animate, state, transition  } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { NetworkService } from '../../providers/network.service';
import { Storage } from '@ionic/storage';
import { MyAccountService } from '../../providers/myAccount.service';
import { MessageModalPage } from '../message-modal/message-modal';

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
  
  public activityNetwork:any = [];
  public myNetwork:any = [];
  public showHomeUserData:any = false;
  public userData:any = {};
  public seeMoreActivityValue:any;
  public seeMoreMyValue:any;
  public countActivity:any;
  public countMy:any;
  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public network: NetworkService, public storage: Storage, public myAccount: MyAccountService) {
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
    this.seeMoreActivityValue = 5;
    this.seeMoreMyValue = 5;
    this.countMy = 0;
    if( ( Object.keys(this.activityNetwork).length ) > 5 ){
      this.activityNetwork = [];
    }
    if( ( Object.keys(this.myNetwork).length ) > 5 ){
      this.myNetwork = [];
    }
    setTimeout(()=>{ 
      this.getActivityNetworkData( this.seeMoreActivityValue );
      this.getMyNetworkData( this.seeMoreMyValue );
    }, 100);
    
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
  
  getActivityNetworkData( limit:any ) {
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.countActivity = Object.keys(this.activityNetwork).length;
        this.network.getDataAccount(val.id, 1, limit, this.countActivity).then(
          (data:any) => {
            var data = JSON.parse(data);
            for (let i in data) {
              this.activityNetwork.push(data[i]);
            }
          }
        );
      }
    });
  }
  
  getMyNetworkData( limit:any ){
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.countMy = Object.keys(this.myNetwork).length;
        this.network.getDataAccount(val.id, 2, limit, this.countMy).then(
          (data:any) => {
            var data = JSON.parse(data);
            for (let i in data) {
              this.myNetwork.push(data[i]);
            }
          }
        );
      }
    });
  }
  
  seeMoreActivity(){
    this.seeMoreActivityValue = ( this.seeMoreActivityValue + 5 );
    setTimeout(()=>{ this.getActivityNetworkData( this.seeMoreActivityValue );  }, 100);
  }
  
  seeMoreMy() {
    this.seeMoreMyValue = ( this.seeMoreMyValue + 5 );
    setTimeout(()=>{ this.getMyNetworkData( this.seeMoreMyValue );  }, 100);
  }
  
  sendMessage(item:any){
    let messageModal = this.modalCtrl.create( MessageModalPage, { destiny: item } );
    messageModal.onDidDismiss(data => {
    });
    messageModal.present();
  }

}