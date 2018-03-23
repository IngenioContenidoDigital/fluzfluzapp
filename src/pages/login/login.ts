import { Component, Output, EventEmitter } from '@angular/core';
import { ViewController, NavController, NavParams, AlertController, Platform, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from '../../providers/confirm.service';
import { Storage } from '@ionic/storage';
import { LoginService } from '../../providers/login-service';
import { PasscodeService } from '../../providers/passcode.service';
import { ConfirmPage } from '../confirm/confirm';
import { TabsService } from '../../providers/tabs.service';
import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { BrowserTab } from '@ionic-native/browser-tab';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AnalyticsService } from '../../providers/analytics.service';
import { URL_RECOVER_PASSWORD } from '../../providers/config';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { StatusBar } from '@ionic-native/status-bar';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [
    LoginService,
    ConfirmService,
    PasscodeService,
    StatusBar,
    AnalyticsService
  ]
})
export class LoginPage {
  public nextLoginButton:boolean;
  public enabledLoginButton:boolean;
  public userData:any = [];
  public userId:any;
  public userConfirm:any;

  tabBarElement: any;
  loginForm: FormGroup;
  
  @Output()
  public updateShowDataUser: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showDataUser = true;
  
  constructor( 
    public modalCtrl: ModalController,
    private confirmService: ConfirmService,
    public loadingController: LoadingController,
    public passcodeService: PasscodeService,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public storage: Storage,
    public alertCtrl: AlertController,
    public tabsService: TabsService,
    public platform: Platform,
    public analytics: AnalyticsService,
    private loginService:LoginService,
    public viewCtrl: ViewController,
    private browserTab: BrowserTab,
    private iab: InAppBrowser,
    private fb: Facebook,
    private googlePlus: GooglePlus,
    public statusBar: StatusBar,
  ) {
    this.loginForm = formBuilder.group({
      'email' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]+[.a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]*@[a-z\p{L}0-9]+(?:[.]?[_a-z\p{L}0-9-])*\.[a-z\p{L}0-9]+$/i)])],
      'pwd': [null, Validators.required]
    });
    platform.ready().then(() => {
      var lastTimeBackPress = 0;
      var timePeriodToExit  = 2000;

      platform.registerBackButtonAction(() => {
        setTimeout(()=>{ 
          let view = this.navCtrl.getActive();
          if (view.component.name == "LoginPage") {
            if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
              this.platform.exitApp();
            }
            else {
              this.showToast('Oprime de nuevo para salir de FluzFluz', 3);
              lastTimeBackPress = new Date().getTime();
            }
          }
        },500);
      });
    })
    .catch(function () {
      console.log("Error");
    });
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('LoginPage'); 
    this.tabsService.hide();
    this.validateLogin();
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }
  
  validateLogin(){
    this.storage.get('userData').then((userData:any | null) => {
      if(userData !== null && userData !== undefined && userData !== false){
        this.storage.get('userId').then((userId:number | null) => {
          this.storage.get('userConfirm').then((userConfirm:boolean | null) => {
            if( ( userData.id != userId ) || !userConfirm ){
              this.goTo('confirmPage');
            }
          });
        });
      }
    });
  }
  
  //Según lo que recibe, manda a alguna página.
  public goTo( valor:any ){
    if ( valor == 'confirmPage' ){
      this.confirmService.getRequestSMS().then((data:any)=>{
        if(data.requestSMS){
          this.navCtrl.setRoot( ConfirmPage );
        }
        else {
          this.navCtrl.setRoot(TabsPage);
        }
      });
    }
    else {
      this.navCtrl.setRoot(TabsPage);
    }
  }
    
  //Valida que los dos campos sean llenados para activar el boton login
  validateInputLogin(event:any) {
    if(this.loginForm.controls['email'].valid && this.loginForm.controls['pwd'].valid) {
      this.enabledLoginButton = true;
    }
    else {
      this.enabledLoginButton = false;
    }      
  }
  
  // Genera una alerta
  showAlert(title:string, message:string){
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Aceptar'
        }
      ]
    });
    alert.present();
  }
  
  showToast(message:string, duration:number, position:string | null = 'middle', cssClass:string | null = 'toast'){
    let toast = this.toastCtrl.create({
      message:  message,
      duration: duration*1000,
      position: position,
      cssClass: cssClass
    });
    toast.present();
  }
  
  //Hace el login en la aplicación
  login(valor:any):void {
    let loader = this.loadingController.create({
      content: "Autenticando..."
    });
    loader.present();
    this.loginService.postLogin(valor).then(
      (response:any)=>{
        loader.dismiss();
        if(response.active == 0 && response.kick_out == 1){
          this.storage.set('userData', null).then(() => {
            this.showAlert("Alerta:", "Tu cuenta se encuentra temporalmente suspendida, si crees que se trata de un error, por favor comunicate con soporte.");
          });
        }
        else if( response.active == 0 && response.kick_out == 0 ){
          this.storage.set('userConfirm', false);
          this.navCtrl.setRoot(ConfirmPage);
        }
        else if( response.active = 1 && response.kick_out == 0 ){
          this.userData = response;
          this.analytics.trackEvent('LoginPage', 'Login', 'El usuario se ha logueado');
          
          // Establece el passcode de la bóveda en true or false.
          this.passcodeService.getPasscode(this.userData.id).then((data:any)=>{
            this.storage.set('passcode', data);
          });
          
          this.storage.get('userId').then((userId:number | null) => {
            this.storage.get('userConfirm').then((userConfirm:boolean | null)=>{
              this.storage.set('userData', response);
              this.storage.set('cart', '');
              if ( !userConfirm || userId !== this.userData.id || (userId === this.userData.id && !userConfirm) ) {
                this.storage.set('userConfirm', false);
                this.storage.set('userId', this.userData.id);
                this.goTo("confirmPage");
              }
              else {
                this.storage.set('userConfirm', true);
                this.storage.set('userId', this.userData.id);
                this.goTo("");
              }
            });
          });
          this.updateShowDataUser.emit(this.showDataUser);
        }
        else {
          let error:any = [];
          error.title = 'Error de autenticación';
          error.message = 'La dirección de correo electrónico y la contraseña que has introducido no coinciden.';
          this.showAlert(error.title, error.message);
        }
      }
    );
  }
    
  //Guarda el id de usurio en el localStorage
  setUserId(value:any):any{
    this.userData = JSON.parse(value);
    this.storage.set('userId', this.userData.id );
    this.analytics.setUserId(this.userData.id);
  }
  
  openUrl(){
    let url = 'http://fluzfluz.com/solicitud-de-invitacion/';
    this.browserTab.isAvailable().then((
      isAvailable: boolean) => {
        if (isAvailable) {
          this.browserTab.openUrl(url);
        } else {
          this.iab.create(url, '_blank', 'location=yes');
          // open URL with InAppBrowser instead or SafariViewController
        }
    })
    .catch(function () {
      console.log("Error");
    });
  }
  
  openRegister(){
    let registerModal = this.modalCtrl.create( RegisterPage );
    registerModal.onDidDismiss(
      (data:any) => {
        if(data !== undefined && data !== null){
          if(data.flagPop == true){this.viewCtrl.dismiss();}
        }
      }
    );
    registerModal.present();
  }
  
  openRecoverPassword(){
    let url = URL_RECOVER_PASSWORD;
    this.browserTab.isAvailable().then((
      isAvailable: boolean) => {
        if (isAvailable) {
          this.browserTab.openUrl(url);
        } else {
          this.iab.create(url, '_blank', 'location=yes');
          // open URL with InAppBrowser instead or SafariViewController
        }
    })
    .catch(function () {
      console.log("Error");
    });
  }
  
  facebook(){
    this.fb.login(['public_profile', 'user_friends', 'email'])
    .then(
      (res: FacebookLoginResponse) => {
        this.fb.api(res.authResponse.userID+"/?fields=id,email,first_name,last_name", []).then((data) =>{
          this.getEmailLoginSocialMedia(data)
        })
        .catch(function () {
          console.log("Error");
        });
      }
      
    )
    .catch(
      (e) => {
        let title = 'Facebook Error';
        let msg = 'Ha ocurrio un error con la plataforma de Facebook. Intenta de nuevo más tarde.';
        let button = 'Ok';
        this.displayError(title, msg, button);
      }
    );
  }
  
  google(){
    this.googlePlus.login({})
    .then(
      (res) => {
        let data:any={};
        data.email = res.email;
        data.first_name = res.givenName;
        data.last_name = res.familyName;
        this.getEmailLoginSocialMedia(data)
      }
    )
    .catch(
      (err) => {
        console.error("error: "+err);
        let title = 'Google Error';
        let msg = 'Ha ocurrio un error con la plataforma de google. Intenta de nuevo más tarde.';
        let button = 'Ok';
        this.displayError(title, msg, button);
      }
    );
  }
  
  getEmailLoginSocialMedia(dataR:any){
    let loader = this.loadingController.create({
      content: "Autenticando..."
    });
    loader.present();
    this.loginService.getEmailSocialMedia(dataR.email).then(
      (data:any) => {
        this.userData = data.result;
        if(data.error == 0){
          loader.dismiss();
          if(this.userData.active == 1 || this.userData.active == "1"){
            this.analytics.trackEvent('LoginPage', 'Login', 'El usuario se ha logueado');

            // Establece el passcode de la bóveda en true or false.
            this.passcodeService.getPasscode(this.userData.id).then((data:any)=>{
              this.storage.set('passcode', data);
            });

            this.storage.get('userId').then((userId:number | null) => {
              this.storage.get('userConfirm').then((userConfirm:boolean | null)=>{
                this.storage.set('userData', this.userData)
                ;
                this.storage.set('cart', '');
                if ( !userConfirm || userId !== this.userData.id || (userId === this.userData.id && !userConfirm) ) {
                  this.storage.set('userConfirm', false);
                  this.storage.set('userId', this.userData.id);
                  this.goTo("confirmPage");
                }
                else {
                  this.storage.set('userConfirm', true);
                  this.storage.set('userId', this.userData.id);
                  this.goTo("");
                }
              });
            });
            this.updateShowDataUser.emit(this.showDataUser);
          }
          else {
            let error:any = [];
            error.title = 'Alerta:';
            error.message = 'Tu cuenta se encuentra temporalmente suspendida, si crees que se trata de un error, por favor comunicate con soporte.';
            this.showAlert(error.title, error.message);
          }
        }
        else if (data.error == 1){
          loader.dismiss();
          let confirm = this.alertCtrl.create({
            title: '¿Aún no estas en Fluz FLuz?',
            message: 'Registrate y empieza a ganar por tus compras.',
            buttons: [
              {
                text: 'Más tarde',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Ok',
                handler: () => {
                  let registerModal = this.modalCtrl.create( RegisterPage, { data: dataR } );
                  registerModal.onDidDismiss(data => {
                  });
                  registerModal.present();
                }
              }
            ]
          });
          confirm.present();
        }
        else{
          loader.dismiss();
          this.displayError('Error de autenticación', data.msg, 'OK');
        }
      }
    );
  }
  
  displayError(title:string, msg:string, button:string) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: msg,
      buttons: [
        {
          text: button,
          handler: () => {
            console.log('Disagree clicked');
          }
        }
      ]
    });
    confirm.present();
  }
}
