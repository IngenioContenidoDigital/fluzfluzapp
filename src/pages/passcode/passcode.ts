import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { PasscodeService } from '../../providers/passcode.service';
import { SupportService } from '../../providers/support.service';
import { VaultPage } from '../vault/vault';
import { RenewPasscodeConfirmPage } from '../renew-passcode-confirm/renew-passcode-confirm';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { AnalyticsService } from '../../providers/analytics.service';
  
@Component({
  selector: 'page-passcode',
  templateUrl: 'passcode.html',
  providers: [
    PasscodeService,
    SupportService,
    AnalyticsService
  ],
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
  constructor(
    public loadingController: LoadingController,
    public tabsService: TabsService,
    public alertCtrl: AlertController,
    public storage: Storage,
    public toastCtrl: ToastController,
    public passcodeService: PasscodeService,
    public supportService: SupportService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public analytics: AnalyticsService
  ) {
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('PasscodePage');
    let loader = this.loadingController.create({
      content: "Cargando..."
    });
    loader.present();
    this.resetPasscode();
    this.storage.get('userData').then((val) => {
      this.passcodeService.getPasscode(val.id).then((data:any)=>{
        this.storage.set('passcode', data).then(()=>{
          this.storage.get('passcode').then((val) => {
            loader.dismiss();
            if( val == 'true' || val == true ){
              this.setPasscode = false;
              this.textHeader  = 'Ingresa tu contraseña';
              this.textButton  = 'CONFIRMAR';
            }
            else {
              this.setPasscode = true;
            }
          });
        });
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
    this.textHeader = 'Ingresa tu contraseña';
    this.textButton = this.setPasscode ? 'ESTABLECER' : 'CONFIRMAR';
  }
  
  confirmContinue(){
    if ( this.setPasscode == true ) {
      if( this.enableConfirmPasscode == true ){
        if ( this.passcode == this.passcodeConfirm ){
          this.storage.get('userData').then((val) => {
            this.passcodeService.setPasscode( val.id, this.passcode ).then((data:boolean)=>{
              this.setPasscode = data;
              this.storage.set('passcode', data );
              let msg = data ? "S" : "No s" ; 
              let toast = this.toastCtrl.create({
                message:  msg+'e ha guardado tu contraseña.',
                duration: 2500,
                position: 'middle'
              });
              toast.present();
              data ? this.goTo('VaultPage') : this.resetPasscode();
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
      this.storage.get('userData').then((val) => {
        let valor = {'id_customer': val.id, 'passcode': this.passcode };
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
  
  showAlertRenewPasscode(){
    let loader = this.loadingController.create({
      content: "Cargando..."
    });
    loader.present();
    this.storage.get('userData').then((val) => {
      loader.dismiss();
      let alert = this.alertCtrl.create({
        title: '¿Olvidaste tu contraseña?',
        message: 'FluzFluz toma muy enserio la seguridad de tu bóveda, es por esto que nuestro equipo de servicio al cliente lo guiará para obtener una nueva clave.',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {}
          },
          {
            text: 'Aceptar',
            handler: () => {
              let loader = this.loadingController.create({
                content: "Cargando..."
              });
              loader.present();
              let value:any = [];
              value.issue = 'Solicitud de restablecimiento de contraseña.';
              value.problem = 'Solicitud de restablecimiento de contraseña.';
              this.supportService.sendProblem(val.id, val.firstname+' '+val.lastname, val.email, value).subscribe(
                success => {
                  if (success.status === 200){
                    loader.dismiss();
                    this.navCtrl.push(RenewPasscodeConfirmPage);
                  }
                  else {
                    loader.dismiss();
                    if (success.status === 400){
                      this.showAlert('Error en el servidor', 'Ha ocurrido un error en el servidor. Por favor intenta de nuevo.');
                    }
                  }
                },
                //Si hay algun error en el servidor.
                error =>{
                  loader.dismiss();
                  this.showAlert('Error', 'Verifica tu conexión y por favor intenta de nuevo.');
                }
              );
            }
          }
        ]
      });
      alert.present();
    });
  }
  
  showAlert(title:string, subTitle:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }
}
