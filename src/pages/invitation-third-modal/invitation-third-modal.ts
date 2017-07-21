import { Component, trigger, style, animate, state, transition  } from '@angular/core';
import { ViewController,ModalController,NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { NetworkService } from '../../providers/network.service';
import { MyAccountService } from '../../providers/myAccount.service';
import { ToastController } from 'ionic-angular';
import { MessageModalPage } from '../message-modal/message-modal';
/**
 * Generated class for the InvitationThirdModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-invitation-third-modal',
  templateUrl: 'invitation-third-modal.html',
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
export class InvitationThirdModalPage {
  
  public enabledLoginButton:boolean;
  public treeNetwork:any = [];
  public countMy:any;
  invitationForm: FormGroup;  

  constructor(public navCtrl: NavController,formBuilder: FormBuilder,public modalCtrl: ModalController, public myAccount: MyAccountService,public toastCtrl: ToastController, public network: NetworkService, public storage: Storage, public navParams: NavParams, public viewCtrl: ViewController) {
    this.invitationForm = formBuilder.group({
      'email' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]+\.[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])],
      'name': [null, Validators.required],
      'lastname': [null, Validators.required]
    });
  }

  ionViewDidLoad() {
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.countMy = Object.keys(this.treeNetwork).length;
        this.network.getDataAccount(val.id, 4, 8, this.countMy).then(
          (data:any) => {
            var data = JSON.parse(data);
            for (let i in data) {
              this.treeNetwork.push(data[i]);
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
  
  onSubmit({value},value2:{}) {
    if (this.invitationForm.controls['email'].valid && this.invitationForm.controls['name'].valid && this.invitationForm.controls['lastname'].valid) {
      this.storage.get('userId').then((val) => {
        if( val != null && val != '' && value != '' && val != undefined ){
          let obj = JSON.stringify(value);
          this.network.getDataAccount(value2, 5, 0, 0, obj).then(
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
              }
              location.reload();
            }
          );
        }
      });
    }
  }
  
  sendMessage(item:any){
    let messageModal = this.modalCtrl.create( MessageModalPage, { destiny: item } );
    messageModal.onDidDismiss(data => {
    });
    messageModal.present();
  }
  
}
