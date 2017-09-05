import { Component, trigger, style, animate, state, transition  } from '@angular/core';
import { ViewController,ModalController,NavController, NavParams, LoadingController } from 'ionic-angular';
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
  public customer:any = [];
  public countMy:any;
  public enabledInvitationButton:any = false;
  public showInvitationForm:any = false;
  invitationForm: FormGroup;  

  constructor(public loadingController: LoadingController, public navCtrl: NavController,formBuilder: FormBuilder,public modalCtrl: ModalController, public myAccount: MyAccountService,public toastCtrl: ToastController, public network: NetworkService, public storage: Storage, public navParams: NavParams, public viewCtrl: ViewController) {
    this.invitationForm = formBuilder.group({
      'firtsname' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]{3,100}$/i)])],
      'lastname' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]{3,100}$/i)])],
      'email' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]+[.a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]*@[a-z\p{L}0-9]+(?:[.]?[_a-z\p{L}0-9-])*\.[a-z\p{L}0-9]+$/i)])],
    });
  }

  ionViewDidLoad() {
    this.getUsersWithInvitations();
  }
  
  getUsersWithInvitations() {
    let loader = this.loadingController.create({
      content: "Cargando..."
    });
    loader.present();
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.network.findInvitation(val.id).then(
          (data:any) => {
            loader.dismiss();
            var data = JSON.parse(data);
            this.customer = data;
          }
        );
      }
    });
  }
  
  sendMessage(item:any){
    let messageModal = this.modalCtrl.create( MessageModalPage, { destiny: item } );
    messageModal.onDidDismiss(data => {
    });
    messageModal.present();
  }
  
  showInvitation(item:any) {
    this.invitationForm.reset();
    setTimeout(()=>{ this.showInvitationForm = this.showInvitationForm == item.id ? false : item.id;  }, 200);
  }
  
  validateInput(event:any) {
    if (
      this.invitationForm.controls['firtsname'].valid &&
      this.invitationForm.controls['lastname'].valid &&
      this.invitationForm.controls['email'].valid
    ) {
      this.enabledInvitationButton = true;
    } 
    else {
      this.enabledInvitationButton = false;
    }
  }
  
  sendInvitation( item:any, formData:any ){
    let loader = this.loadingController.create({
      content: "Enviando..."
    });
    loader.present();
    if (this.invitationForm.controls['email'].valid && this.invitationForm.controls['firtsname'].valid && this.invitationForm.controls['lastname'].valid) {
      this.network.sendInvitation(item.id, formData).then(
        (data:any) => {
          loader.dismiss();
          let d = JSON.parse(data);
          let errorMessage = '';
          if( d.error < 4 ){
            setTimeout(()=>{ this.getUsersWithInvitations(); }, 500);
            this.showInvitation(false);
          }
          if(d.error == '0'){
            errorMessage = 'Invitación enviada correctamente.';
          }
          else {
            switch (d.error){
              case '1': {
                errorMessage = 'Este Fluzzer no tiene invitaciones disponibles.';
                break;
              }
              case '2': {
                errorMessage = 'Nombre o apellido incorrecto.';
                break;
              }
              case '3': {
                errorMessage = 'El correo ya se encuentra en uso.';
                break;
              }
              default: {
                errorMessage = 'Ha ocurrido un error, intenta de nuevo.';
                break;
              }
            }
          }
          let toast = this.toastCtrl.create({
            message: errorMessage,
            position: 'middle',
            duration: 2000,
          });
          toast.present();
        }
      );
    }
  }
}
        
