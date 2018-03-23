// Native
import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

// Plugins
import { Deeplinks } from 'ionic-native';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { FCM } from "@ionic-native/fcm";
import { Badge } from '@ionic-native/badge';
//import { Firebase } from '@ionic-native/firebase';

// Services
import { AnalyticsService } from '../providers/analytics.service';
import { LoginService } from '../providers/login-service';
import { MessagesService } from '../providers/messages.service';
import { ConfirmService } from '../providers/confirm.service';

//Navigation
import { TabsPage } from '../pages/tabs/tabs';
//import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ConfirmPage } from '../pages/confirm/confirm';

@Component({
  templateUrl: 'app.html',
  providers: [
    FCM,
    AnalyticsService,
    LoginService,
    MessagesService,
    ConfirmService
  ]
})
export class MyApp {
  @ViewChild(NavController) navCtrl:NavController;
  
  public rootPage:any;
  public rootPageParams:any;

  constructor(
    // Native
    public platform: Platform,
    public loadingController: LoadingController,
    private alertCtrl: AlertController,
    
    // Plugins
//    private firebase: Firebase,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storage: Storage,
    public fcm: FCM,
    private badge: Badge,
    
    // Services
    private analytics: AnalyticsService,
    private loginService: LoginService,
    private messagesService: MessagesService,
    private confirmService: ConfirmService
  ) {
//    this.firebaseStart();
    this.statusBar.backgroundColorByHexString('#E1493A');
    
    platform.ready().then(() => {
//      this.fcmStart();
      this.badge.clear();
      this.analytics.analytictsStart();
      setTimeout(()=>{
        this.splashScreen.hide();
        this.validateViewToRoot();
      },1000);
      this.deeplinkStart();
    })
    .catch(error =>{
      this.showAlert("Error:", "Ha ocurrido un error al iniciar la plataforma, por favor reinicia FluzFluz.");
    });
  }
  
  validateViewToRoot(){
    this.storage.get('userData').then(
      (userData:any)=>{
        if (userData === null || userData === undefined || userData === false){
          this.rootPage = LoginPage;
        }
        else if (userData.Active == 0 && userData.kickout == 1) {
          this.storage.set('userData', null).then(() => {
            this.showAlert("Alerta:", "Tu cuenta se encuentra temporalmente suspendida, si crees que se trata de un error, por favor comunicate con soporte.");
            this.rootPage = LoginPage;
          });
        }
        else if (userData.active == 0 && userData.kick_out == 0) {
          this.storage.set('userConfirm', false);
          this.rootPage = ConfirmPage;
        }
        else {
          this.storage.get('userConfirm').then((userConfirm) => {
            if (userConfirm !== true) {
              this.rootPage = ConfirmPage;
            }
            else {
              this.rootPage = TabsPage;
            }
          })
          .catch(function () {
            this.showAlert("Error:", "Ha ocurrido un error al obtener los datos locales, por favor reinicia FluzFluz.");
          });
        }
      }
    )
    .catch(function () {
      this.showAlert("Error:", "Ha ocurrido un error al obtener los datos locales, por favor reinicia FluzFluz.");
    });
  }
  
  
  ngAfterViewInit() {
  }
      
  deeplinkStart() { 
    this.platform.ready().then(() => {
      Deeplinks.route({
        '/': "asdfasdf"
      }).subscribe((match) => {
        let paramsGet = match.$args;
        if(paramsGet != null && paramsGet != '' && paramsGet != undefined && paramsGet != 'undefined' && paramsGet != 'null'){
          if(paramsGet.id_customer != null && paramsGet.id_customer != '' && paramsGet.id_customer != undefined && paramsGet.id_customer != 'undefined' && paramsGet.id_customer != 'null'){
            this.storage.get('userData').then(
              (userData:any)=>{
                if (userData !== null || userData !== undefined || userData !== false){
                  if(userData.Active == 0 && userData.kickout == 1){
                    this.showAlert("Alerta:", "Tu cuenta se encuentra temporalmente suspendida, si crees que se trata de un error, por favor comunicate con soporte.");
                    this.rootPage = LoginPage;
                  }
                  else if (userData.active == 0 && userData.kick_out == 0) {
                    if(paramsGet.id_customer == userData.id){
                      this.storage.set('userConfirm', false);
                      let loader = this.loadingController.create({
                        content: "Enviando sms..."
                      });
                      loader.present();
                      this.confirmService.sendSMS(paramsGet.id_customer).then((response:any)=>{
                        loader.dismiss();
                        if(response == '"Se ha enviado el sms."'){
                          this.rootPage = ConfirmPage;
                        }
                        else{
                          this.showAlert("Error:","No se ha enviado el código de verificación, por favor intenta nuevamente.");
                        }
                      }).catch(function () {
                        loader.dismiss();
                        this.showAlert("Error:", "Ha ocurrido un error al intentar enviar el código de verificación, por favor reinicia FluzFluz.");
                      });
                    }
                    else {
                      this.showAlert("Error:","Este link de activación de cuenta no corresponde a este usuario.");
                    }
                  }
                  else if(userData.active == 1 && userData.kick_out == 0){
                    this.showAlert("Felicitaciones:", "Tu cuenta ya se encuentra activa, No es necesario activarla de nuevo.");
                  } 
                }
                else {
                  this.showAlert("Error:","No se ha creado ningun Fluzzer en este dispositivo.");
                }

              }
            );
          }
        }
        else {
          this.validateViewToRoot();
        }
      }, (nomatch) => {
        console.log(nomatch);
        this.validateViewToRoot();
      });
    });
  }
  
//  firebaseStart(){
//    this.platform.ready().then(() => {
//      if (this.platform.is('iOS')) {
//        this.firebase.grantPermission();
//      }
//    });
//    
//    
//    this.firebase.onNotificationOpen().subscribe((notification:any)=> {
//      console.log(notification);
//    }, function(error) {
//      console.error(error);
//    });
//    
//    this.firebase.getToken()
//    .then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
//    .catch(error => console.error('Error getting token', error));
//
//    this.firebase.onTokenRefresh()
//    .subscribe((token: string) => console.log(`Got a new token ${token}`));
//  }npm install --save @ionic-native/deeplinks
  
  fcmStart(){
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.fcm.getToken()
          .then((token:string)=>{
            console.log('token  '+token);
            //aquí se debe enviar el token al back-end para tenerlo registrado y de esta forma poder enviar mensajes
            // a esta  aplicación
            //o también copiar el token para usarlo con Postman :D
            this.storage.get('userData').then(
              (val) => {
                if ( val === null || val === undefined || val === false || val === '' ){
                  this.storage.set('tokenFCM', token);
                }
                else {
                  this.getMessagesData(val.id);
                  this.storage.set('tokenFCM', token).then(()=>{
                    this.loginService.setTokenFCM(val.id, token).then((result:any)=>{
                      console.log( (result) ? 'Si se actualizo': 'No funciono');
                    })
                    .catch(error =>{
                      console.log(error);
                    });
                  })
                  .catch(error =>{
                    console.log(error);
                  });
                }
              }
            )
          .catch(error =>{
            console.log(error);
          });
          })
          .catch(error=>{
            //ocurrió un error al procesar el token
            console.error(error);
          });

        /**
         * No suscribimos para obtener el nuevo token cuando se realice un refresh y poder seguir procesando las notificaciones
         * */
        this.fcm.onTokenRefresh().subscribe(
          (token:string)=>{
            console.log("Nuevo token",token),
            this.storage.get('userData').then(
              (val) => {
                this.storage.set('tokenFCM', token).then(()=>{
                  this.loginService.setTokenFCM(val.id, token).then((result:any)=>{
                    console.log( (result) ? 'Si se actualizo': 'No funciono');
                  })
                  .catch(error =>{
                    console.log(error);
                  });
                })
                .catch(error =>{
                  console.log(error);
                });
              }
            )
            .catch(error =>{
              console.log(error);
            });
          }
        );

        /**
         * cuando la configuración este lista, vamos a procesar los mensajes
         * */
        this.fcm.onNotification().subscribe(
          (data:any)=>{
            this.badge.increase(1);
            if(data.wasTapped){
              //ocurre cuando nuestra app está en segundo plano y hacemos tap en la notificación que se muestra en el dispositivo
              this.badge.clear();
            }else{
              this.badge.clear();
              //ocurre cuando nuestra aplicación se encuentra en primer plano,
              //puedes mostrar una alerta o un modal con los datos del mensaje
            }
           },error=>{
           }
        );
      }
      else {
        console.log('Alerta: \n No es posible iniciar cordova para usar FCM. \n');
      }
    })
    .catch(error =>{
      console.log(error);
    }); 
  }
  
  getMessagesData(id: number) {
    this.messagesService.getMessagesData(id).then(
      (data:any)=>{
        if(data > 0){
          this.badge.increase(data);
        }
        else {
          this.badge.clear();
        }
      }
    )
    .catch(error =>{
      console.log(error);
    });
  }
  
  showAlert(title:string, msg:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }
}
