import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { AnalyticsService } from '../providers/analytics.service';
import { AlertController } from 'ionic-angular';
import { FCM } from "@ionic-native/fcm";
import { LoginService } from '../providers/login-service';
import { Storage } from '@ionic/storage';
import { Badge } from '@ionic-native/badge';
import { MessagesService } from '../providers/messages.service';

@Component({
  templateUrl: 'app.html',
  providers: [AnalyticsService, LoginService, FCM, MessagesService,]
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor( 
    private alertCtrl: AlertController,
    public fcm:FCM,
    private badge: Badge,
    public analytics: AnalyticsService,
    public platform: Platform,
    public statusBar: StatusBar,
    public storage: Storage,
    public messagesService: MessagesService,
    private loginService:LoginService,
    splashScreen: SplashScreen
  ) {
    this.fcmStart();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      setTimeout(()=>{
        this.statusBar.backgroundColorByHexString('#E1493A');
      }, 500 );
      this.badge.clear();
      splashScreen.hide();
      this.analytics.analytictsStart();
    });
  }
  
  fcmStart(){
    this.platform.ready().then(() => {
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
                  });
                });
              }
            }
          );
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
                });
              });
            }
          );
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
    );
  }
}
