import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { PasscodeService } from '../../providers/passcode.service';
import { VaultPage } from '../vault/vault';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';

/**
 * Generated class for the Passcode page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-passcode',
  templateUrl: 'passcode.html',
  providers: [PasscodeService],
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
export class PasscodePage {
  
  public setPasscode:any = false;
  public passcode:any = '';
  public passcodeConfirm:any = '';
  public enableKeyboard:any = true;
  public enableConfirmPasscode:any = false;
  public textHeader:string = 'Ingresa tu contraseña';
  public textButton:string = 'ESTABLECER';
  public response:any;
  constructor( public loadingController: LoadingController, public tabsService: TabsService, public alertCtrl: AlertController, public storage: Storage, public toastCtrl: ToastController, public passcodeService: PasscodeService, public navCtrl: NavController, public navParams: NavParams) {
  }
  
  ionViewWillEnter(){
    this.resetPasscode();
    this.storage.get('userId').then((val) => {
      this.passcodeService.getPasscode(val).then((data:any)=>{
          console.log(data['0']);
          this.response = data['0'];
          if( this.response.vault_code === null || this.response.vault_code === 'null' || this.response.vault_code == undefined || this.response.vault_code == 'undefined' ){
            console.log("Voy a guardar una contraseña");
            this.setPasscode = true;
          }
          else {
            this.setPasscode = false;
            console.log("Ya tengo contraseña.");
            this.textHeader = 'Ingresa tu contraseña';
            this.textButton = 'CONFIRMAR';
          }
      });
    });
  }
  
  clickButton(value:any){
    if ( this.enableKeyboard ) {
      this.passcode += value;
    }
    if ( this.passcode.length == 4) {
      this.enableKeyboard = false;
    }
  }
  
  resetPasscode(){
    this.enableConfirmPasscode = false;
    this.enableKeyboard = true;
    this.passcode = '';
  }
  
  confirmContinue(){
    if ( this.setPasscode == true ) {
      if( this.enableConfirmPasscode == true ){
        if ( this.passcode == this.passcodeConfirm ){
          this.storage.get('userId').then((val) => {
            this.passcodeService.setPasscode( val, this.passcode ).then((data:any)=>{
              let response = JSON.parse(data);
              this.setPasscode = response ? false : true;
              let toast = this.toastCtrl.create({
                message:  'Se ha guardado tu contraseña.',
                duration: 2500,
                position: 'middle'
              });
              toast.present();
              this.goTo('VaultPage');            
            });
          });
        }
        else {
          this.resetPasscode();
          let toast = this.toastCtrl.create({
            message:  'Las contraseñas no coinciden.',
            duration: 2500,
            position: 'middle'
          });
          toast.present();
        }
      }
      else {
        this.enableConfirmPasscode = true;
        this.passcodeConfirm = this.passcode;
        this.enableKeyboard = true;
        setTimeout(()=>{ this.passcode = '' }, 100 );
        this.textButton = 'CONFIRMAR';
        setTimeout(()=>{ this.textHeader = 'Por favor confirma tu contraseña' }, 500 );
      }
    }
    else {
      let loader = this.loadingController.create({
        content: "Confirmando..."
      });
      loader.present();
      this.storage.get('userId').then((val) => {
        let valor = {'id_customer': val, 'passcode': this.passcode };
        this.passcodeService.validatePasscode(valor).subscribe(
          success => {
            if (success.status === 200){
              loader.dismiss();
              this.goTo("VaultPage");
            }
            else {
              loader.dismiss();
              if (success.status === 204){
                this.showErrorValidate();
              }
            }
          },
          //Si hay algun error en el servidor.
          error =>{ 
            console.log(error)
          }
        );
      });
    }
  }
  
  goTo(value){
    switch (value){
      case "VaultPage": {
        this.navCtrl.push( VaultPage );
        break;
      }
      default: {
        this.tabsService.changeTabInContainerPage(0);
        this.navCtrl.pop();        
        break;
      }
    }
  }
  
  showErrorValidate() {
    let errorValidate = this.alertCtrl.create({
      title: 'Error de autenticación',
      message: 'La contraseña que has introducido no coincide.',
      buttons: [
        {
          text: 'Volver a intentar',
          handler: () => {
            console.log('Disagree clicked');
            this.passcode = '';
            this.enableKeyboard = true
          }
        }
      ]
    });
    errorValidate.present();
	}
}
