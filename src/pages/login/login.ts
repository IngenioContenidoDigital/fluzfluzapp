import { Component, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [
    LoginService,
    PasscodeService,
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
    private browserTab: BrowserTab,
    private iab: InAppBrowser,
  ) {
    this.tabBarElement = document.querySelector('.tabbar .show-tabbar');
  	this.loginForm = formBuilder.group({
      'email' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]+[.a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]*@[a-z\p{L}0-9]+(?:[.]?[_a-z\p{L}0-9-])*\.[a-z\p{L}0-9]+$/i)])],
      'pwd': [null, Validators.required]
    });
    platform.ready().then(() => {
        //back button handle
        //Registration of push in Android and Windows Phone
        var lastTimeBackPress = 0;
        var timePeriodToExit  = 2000;

        platform.registerBackButtonAction(() => {
            // get current active page
            let view = this.navCtrl.getActive();
            if (view.component.name == "LoginPage") {
                //Double check to exit app
                if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
                    this.platform.exitApp(); //Exit from app
                } else {
                    let toast = this.toastCtrl.create({
                        message:  'Oprime de nuevo para salir de FluzFluz',
                        duration: 3000,
                        position: 'middle',
                        cssClass: "toast"
                    });
                    toast.present();
                    lastTimeBackPress = new Date().getTime();
                }
            }
            else {
              this.navCtrl.pop({});
            }
        });
    });
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('LoginPage');
    this.tabsService.hide();
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }
  
  //Según lo que recibe, manda a alguna página.
  public goTo( valor:any ){
    if ( valor == 'confirmPage' ){
      this.storage.set('userConfirm', false);
      this.navCtrl.push( ConfirmPage );
    }
    else {
      this.storage.get('userData').then((val) => {
        if (val === null || val === undefined ){
          this.storage.set('userData', false);
        }
      });
      setTimeout(()=>{ this.navCtrl.setRoot(TabsPage); }, 100);
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
  
  //Hace el login en la aplicación
  login(valor:any):void {
    let loader = this.loadingController.create({
      content: "Autenticando..."
    });
    loader.present();
  	this.loginService.postLogin(valor).subscribe(
     	success => {
        loader.dismiss();
        if(success.status === 200) {
          this.analytics.trackEvent('LoginPage', 'Login', 'El usuario se ha logueado');
          this.userData = JSON.parse(success._body);
          // Establece el passcode en true or false.
          this.passcodeService.getPasscode(this.userData.id).then((data:any)=>{
            this.storage.set('passcode', data);
          });
          
          //Obtiene el id de algún antiguo usuario.
          this.storage.get('userId').then((val) => {
            //Valida si hay o no usuario antiguo.
            if ( val != undefined && val != null ){
              //Guarda el id antiguo y la respuesta del servidor.
              this.userId = val;
              this.userData = JSON.parse(success._body);
              
              
              //Valida si son el mismo usuario. (El id antiguo y el nuevo.)
              if ( this.userId === this.userData.id ) {
                this.storage.set('userData', JSON.parse(success._body));
                //Si aún no está confirmado, manda a confirmar la cuenta.
                this.storage.get('userConfirm').then((val) => {
                  if ( val !== true ){
//                    this.goTo("confirmPage");
                    setTimeout(()=>{
                      this.storage.set('userConfirm', true);
                      this.goTo("");
                    }, 100 );
                  }
                  else {
                    //manda a home.
                    setTimeout(()=>{
                      this.storage.set('userConfirm', true);
                      this.goTo("");
                    }, 100 );
                  }
                });
              }
              //Si no son iguales, manda a confirmar la cuenta.
              else {
                this.storage.set('userData', JSON.parse(success._body));
                this.storage.set('cart', '');
//                this.goTo("confirmPage");
                setTimeout(()=>{
                  this.storage.set('userConfirm', true);
                  this.goTo("");
                }, 100 );
                this.setUserId(success._body);
              }
            }
            //si no hay antiguo, manda a confirmar la cuenta.
            else {
              this.storage.set('userData', JSON.parse(success._body));
//              this.goTo("confirmPage");
              this.storage.set('userConfirm', true);
              setTimeout(()=>{
                this.storage.set('userConfirm', true);
                this.goTo("");
              }, 100 );
              this.setUserId(success._body);
            }
          });
          this.updateShowDataUser.emit(this.showDataUser);
        }
        //Si no están bien los datos le muestra una alerta
        else {
          this.showConfirm();
        }
      },
      //Si hay algun error en el servidor.
      error =>{
        loader.dismiss();
        console.log(error)
      }
    );
  }
    
  //Guarda el id de usurio en el localStorage
  setUserId(value:any):any{
    this.userData = JSON.parse(value);
    this.storage.set('userId', this.userData.id );
    this.analytics.setUserId(this.userData.id);
  }
    
  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Error de autenticación',
      message: 'La dirección de correo electrónico y la contraseña que has introducido no coinciden.',
      buttons: [
        {
          text: 'Volver a intentar',
          handler: () => {
            console.log('Disagree clicked');
          }
        }
      ]
    });
    confirm.present();
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
    });
  }
  
  openRegister(){
    let registerModal = this.modalCtrl.create( RegisterPage );
    registerModal.onDidDismiss(data => {
    
    });
    registerModal.present();
  }

}