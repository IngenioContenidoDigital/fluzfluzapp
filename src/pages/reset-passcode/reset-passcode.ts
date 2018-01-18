import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { PasscodeService } from '../../providers/passcode.service';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { AnalyticsService } from '../../providers/analytics.service';
  
@Component({
  selector: 'page-reset-passcode',
  templateUrl: 'reset-passcode.html',
  providers: [
    PasscodeService,
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
export class ResetPasscodePage {
  
  public passcode:string = '';                    //Almacena la contraseña que se este usando para bloquear el teclado y marcar los puntos en el html
  public passcodeActual:string = '';              //Almacena la contraseña Actual
  public passcodeChange:string = '';              //Almacena la contraseña Nueva
  public enableKeyboard:boolean = true;           //Bandera de habilitar el teclado
  public passcodeChangeConfirm:string = '';       //Almacena la confirmacion de la contraseña Nueva
  public validPasscode:boolean = false;           //Bandera de contraseña Actual
  public textInfo:string   = 'Ingresa tu contraseña actual'; //Texto de informacion
  public textButton:string = 'CONTINUAR';         //texto del boton derecho
  public getPasscode:boolean = false;
  
  constructor(
    public loadingController: LoadingController,
    public tabsService: TabsService,
    public alertCtrl: AlertController,
    public storage: Storage,
    public toastCtrl: ToastController,
    public passcodeService: PasscodeService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public analytics: AnalyticsService
  ) {
  }
  
  ionViewWillEnter(){
    this.tabsService.hide();
    this.analytics.trackView('ResetPasscodePage');
    let loader = this.loadingController.create({
      content: "Cargando..."
    });
    loader.present();
    this.storage.get('passcode').then((val) => {
      loader.dismiss();
      if( val == 'true' || val == true ){
        this.validPasscode = false;
        this.passcodeActual = this.passcodeChange = this.passcodeChangeConfirm = '';
        this.textInfo    = 'Ingresa tu contraseña actual';
        this.textButton = 'CONFIRMAR';
      }
      else {
        this.validPasscode = true;
      }
    });
  }
  
  ionViewWillLeave(){
    this.tabsService.show();
  }
  
  clickButton(value:string){ 
    if ( this.enableKeyboard ) {
      this.passcode += value;
    }
    if ( this.passcode.length == 4 ) {
      this.enableKeyboard = false;
    }
  }
  
  resetPasscode(){
    this.enableKeyboard = true;
    this.passcode = '';
    if( this.validPasscode ){
      this.textInfo = 'Ingresa tu nueva contraseña.';
      this.textButton = 'ESTABLECER';
      this.passcodeChange = '';
      this.passcodeChangeConfirm = '';
    }
  }
  
  confirmContinue(){
    let loader = this.loadingController.create({
      content: "Validando..."
    });
    if( this.passcode.length == 4 ){
      if( !this.validPasscode ){
        loader.present();
        this.passcodeActual = this.passcode;
        this.storage.get('userData').then(
          (userData:any) => {
            let validateData = {'id_customer': userData.id, 'passcode': this.passcodeActual };
            this.passcodeService.validatePasscode(validateData).then(
              (success:any) => {
                loader.dismiss();
                setTimeout(()=>{ this.passcode = '' }, 100 );
                this.enableKeyboard = true;
                if( success.status === 200 ){
                  this.validPasscode = true;
                  this.resetPasscode();
                }
                else if( success.status === 204 ){
                  this.validPasscode = false;
                  this.showAlert("Error al verificar la contraseña", "La contraseña que ingresaste no corresponde a la actual registrada, por favor verifica e intenta de nuevo.");
                }
                else{
                  this.showAlert("Error al verificar la contraseña", "Ha ocurrido un error. Por favor comprueba tu conexión, e intenta de nuevo.");
                }
              },
              () =>{
                loader.dismiss();
                this.showAlert("Error al verificar la contraseña", "Ha ocurrido un error. Por favor comprueba tu conexión, e intenta de nuevo.");
              }
            );
          },
          () => {
            this.showAlert("Error de datos", "Ha ocurrido un error al consultar los datos del usuario.");
          }
        ); 
      }
      else {
        if( this.passcodeChange == '' ){
          this.passcodeChange = this.passcode;
          loader.present().then(()=>{
            setTimeout(()=>{ this.passcode = '' }, 100 );
            this.textButton = 'CONFIRMAR';
            this.textInfo = 'Ahora, confirma tu nueva contraseña.';
            this.enableKeyboard = true;
            loader.dismiss();
          });
        }
        else if ( this.passcodeChange != '' && this.passcodeChangeConfirm == '' ){
          this.passcodeChangeConfirm = this.passcode;
          setTimeout(()=>{
            if ( this.passcodeChange == this.passcodeChangeConfirm ){
              loader.present().then(()=>{
                setTimeout(()=>{ this.passcode = '' }, 100 );
                loader.dismiss().then(
                  ()=>{
                    this.storage.get('userData').then(
                    (userData:any) => {
                      let validateData = {'id_customer': userData.id, 'passcode': this.passcodeChange };
                      this.passcodeService.updatePasscode(validateData).then(
                        (success:any) => {
                          if( success.status === 200 ){
                            this.showAlert("Actualización Exitosa!", "Se actualizó la contraseña de la bóveda de códigos correctamente.");
                            this.navCtrl.pop();
                          }
                          else if( success.status === 204 ){
                            this.showAlert("Error al actualizar la contraseña", "No se pudo actualizar la contraseña, por que esta debe ser diferente a la actual. Por favor intenta de nuevo.");
                            this.resetPasscode();
                          }
                          else{
                            this.showAlert("Error al actualizar la contraseña", "Ha ocurrido un error en el servidor. Por favor intenta de nuevo.");
                            this.resetPasscode();
                          }
                        },
                        () =>{
                          this.showAlert("Error al actualizar la contraseña", "Ha ocurrido un error. Por favor comprueba tu conexión, e intenta de nuevo.");
                          this.resetPasscode();
                        }
                      );
                    },
                    ()=>{
                      this.showAlert("Error de datos", "Ha ocurrido un error al consultar los datos del usuario.");
                      this.resetPasscode();
                    });
                  }
                );
              });
            }
            else{
              this.showAlert("Error al establecer la contraseña", "No se pudo confirmar las contraseñas, por que estas no coinciden. Por favor intenta de nuevo.");
              this.resetPasscode();
            }
          }, 100 );
        }
        else{
          this.showAlert("Error al verificar la contraseña", "Ha ocurrido un error. Por favor intenta de nuevo.");
        }
      }
    }
    else{
      this.showAlert("Error al validar la contraseña", "La contraseña debe contener 4 números.");
    }
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
