import { Component, trigger, style, animate, state, transition  } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { NetworkService } from '../../providers/network.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { MyAccountService } from '../../providers/myAccount.service';
import { MessageModalPage } from '../message-modal/message-modal';
import { InvitationThirdModalPage } from '../invitation-third-modal/invitation-third-modal';
import { ToastController } from 'ionic-angular';

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
  public myInvitation:any = [];
  public showHomeUserData:any = false;
  public userData:any = {};
  public seeMoreActivityValue:any;
  public seeMoreMyValue:any;
  public countInvitation:any;
  public countActivity:any;
  public countMy:any;
  public enabledLoginButton:boolean;
  public contPending:number = 0;
  public contConfirm:number = 0;
  
  invitationForm: FormGroup;
  
  constructor(public modalCtrl: ModalController,public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder, public network: NetworkService, public storage: Storage, public myAccount: MyAccountService) {
        this.invitationForm = formBuilder.group({
            'email' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]+\.[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])],
            'name': [null, Validators.required],
            'lastname': [null, Validators.required]
        });
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
    this.countInvitation = 2;
    this.countMy = 0;
    if( ( Object.keys(this.activityNetwork).length ) > 5 ){
      this.activityNetwork = [];
    }
    if( ( Object.keys(this.myNetwork).length ) > 5 ){
      this.myNetwork = [];
    }
    if( ( Object.keys(this.myInvitation).length ) <= 2  ){
      this.myInvitation = [];
      this.contPending = 0;
      this.contConfirm = 0;
    }
    setTimeout(()=>{ 
      this.getActivityNetworkData( this.seeMoreActivityValue );
      this.getMyNetworkData( this.seeMoreMyValue );
      this.getMyInvitationData(this.countInvitation);
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
  
  getMyInvitationData(limit:any){
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
          this.countMy = Object.keys(this.myInvitation).length;
          this.network.getDataAccount(val.id, 3, limit, this.countMy).then(
          (data:any) => {
              //this.myInvitation = JSON.parse(data);
              //console.log( this.myInvitation );
            var data = JSON.parse(data);
            console.log(data);
            if(data == ''){
                this.myInvitation.push(data);
            }
            else{
                for (let i in data) {
                    if(data[i]['status']=='Pendiente'){
                        this.contPending += 1;
                        console.log(this.contPending);
                    }
                    else if(data[i]['status']=='Confirmado'){
                        this.contConfirm += 1;
                        console.log(this.contConfirm);
                    }
                    this.myInvitation.push(data[i]);
                }
            }
          }
        );
      }
    });
  }
  
  validateInputLogin(event:any) {
    if(this.invitationForm.controls['email'].valid && this.invitationForm.controls['name'].valid) {
      this.enabledLoginButton = true;
    }
    else {
      this.enabledLoginButton = false;
    }      
  }
  
  onSubmit({value}) {
      if (this.invitationForm.controls['email'].valid && this.invitationForm.controls['name'].valid && this.invitationForm.controls['lastname'].valid) {
          
          this.storage.get('userId').then((val) => {
            if( val != null && val != '' && value != '' && val != undefined ){
              let obj = JSON.stringify(value);
              console.log(obj);
              this.network.getDataAccount(val, 5, 0, 0, obj).then(
                (data:any) => {
                  if(data == "Invitacion Erronea: Este Mail ya Existe"){
                    let toast = this.toastCtrl.create({
                      message: data,
                      duration: 2500,
                      position: 'middle'
                    });
                    toast.present();
                  }
                  else{
                    let toast = this.toastCtrl.create({
                      message: data,
                      duration: 2500,
                      position: 'middle'
                    });
                    toast.present();  
                    this.navCtrl.push(NetworkPage);   
                  }
                  //this.navCtrl.push(NetworkPage);   
                  //location.reload();
                }
              );
            }
          });
        }
  }
  
  pushNewUser(){
      this.navCtrl.push(InvitationThirdModalPage);
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
