// Native
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';

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
import { CategoryService } from '../providers/category.service';
import { ConfirmService } from '../providers/confirm.service';
import { TabsService } from '../providers/tabs.service';
import { SearchService } from '../providers/search.service';

//Navigation
import { TabsPage } from '../pages/tabs/tabs';
//import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ConfirmPage } from '../pages/confirm/confirm';
import { CategoryPage } from '../pages/category/category';
import { ProductChildPage } from '../pages/product-child/product-child';
import { ProductFatherPage } from '../pages/product-father/product-father';

@Component({
  templateUrl: 'app.html',
  providers: [
    FCM,
    AnalyticsService,
    LoginService,
    MessagesService,
    CategoryService,
    SearchService,
    ConfirmService
  ]
})
export class MyApp {
  @ViewChild(Nav) navCtrl:Nav;
  
  public rootPage:any;
  public rootPageParams:any;
  public link:any = false;

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
    public categoryService: CategoryService,
    public searchService: SearchService,
    public tabsService: TabsService,
    public toastCtrl: ToastController,
    private confirmService: ConfirmService
  ) {
//    this.firebaseStart();
    this.statusBar.backgroundColorByHexString('#E1493A');
    
    platform.ready().then(() => {
      this.fcmStart();
      this.badge.clear();
      this.analytics.analytictsStart();
      setTimeout(()=>{
        this.splashScreen.hide();
//        this.validateViewToRoot();
      },2000);
      this.deeplinkStart();
    })
    .catch(error =>{
      this.showAlert("Error:", "Ha ocurrido un error al iniciar la plataforma, por favor reinicia FluzFluz.");
    });
  }
  
  validateViewToRoot(deeplink:any = false){
    this.storage.get('userData').then(
      (userData:any)=>{
        if (userData === null || userData === undefined || userData === false){
          this.navCtrl.setRoot(LoginPage,{
            "deeplink": deeplink
          });;
        }
        else if (userData.Active == 0 && userData.kickout == 1) {
          this.storage.set('userData', null).then(() => {
            this.showAlert("Alerta:", "Tu cuenta se encuentra temporalmente suspendida, si crees que se trata de un error, por favor comunicate con soporte.");
            this.navCtrl.setRoot(LoginPage,{
              "deeplink": deeplink
            });
          });
        }
        else if (userData.active == 0 && userData.kick_out == 0) {
          this.storage.set('userConfirm', false);
          this.confirmService.getRequestSMS().then((data:any)=>{
            if(data.requestSMS){
              this.navCtrl.setRoot(ConfirmPage,{
                "deeplink": deeplink
              });
            }
            else{
              this.navCtrl.push( TabsPage ); 
            }
          });
        }
        else {
          this.storage.get('userConfirm').then((userConfirm) => {
            if (userConfirm !== true) {
              this.confirmService.getRequestSMS().then((data:any)=>{
                if(data.requestSMS){
                  this.navCtrl.setRoot(ConfirmPage,{
                    "deeplink": deeplink
                  });
                }
                else{
                  this.navCtrl.push( TabsPage ); 
                }
              });
            }
            else {
              this.navCtrl.setRoot(TabsPage).then(()=>{
                setTimeout(()=>{
                  if(deeplink != false){
                    this.openDeeplink(deeplink);
                  }
                  else {
                    this.tabsService.changeTabInContainerPage(0);
                  }
                },500);
              });
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
      try {
        Deeplinks.route({
          '/': "asdfasdf"
        }).subscribe((match) => {
        console.log('match');
        console.log(match);
          let paramsGet = match.$args;
          if(paramsGet != null && paramsGet != '' && paramsGet != undefined && paramsGet != 'undefined' && paramsGet != 'null'){
            if(paramsGet.id_customer != null && paramsGet.id_customer != '' && paramsGet.id_customer != undefined && paramsGet.id_customer != 'undefined' && paramsGet.id_customer != 'null'){
              this.storage.get('userData').then(
                (userData:any)=>{
                  if (userData !== null && userData !== undefined && userData !== false){
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
                        this.confirmService.getRequestSMS().then((data:any)=>{
                          if(data.requestSMS){
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
                          else{
                            this.navCtrl.push( TabsPage ); 
                          }
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
            else {
              this.validateViewToRoot();
            }
          }
          else {
            this.validateViewToRoot();
          }
        }
        ,(nomatch) => {
          console.log('nomatch');
          console.log(nomatch);
          this.link = nomatch.$link.path;
//        this.link = "/es/mi-cuenta";
//        let link = "/es/inicio/261-bono-popsy.html";
          let GET_params = nomatch.$link.queryString;
          let params = GET_params.split("=");
          console.log('params');
          console.log(params);
          if(params[0] == "id_customer"){
            let id_customer = params[1];
            if(!isNaN(Number(id_customer))){
              console.log("Entro...");
              this.storage.get('userData').then(
                (userData:any)=>{
                  console.log('userData');
                  console.log(userData);
                  if (userData !== null && userData !== undefined && userData !== false){
                    if(userData.Active == 0 && userData.kickout == 1){
                      this.showAlert("Alerta:", "Tu cuenta se encuentra temporalmente suspendida, si crees que se trata de un error, por favor comunicate con soporte.");
                      this.rootPage = LoginPage;
                    }
                    else if (userData.active == 0 && userData.kick_out == 0) {
                      if(id_customer == userData.id){
                        this.storage.set('userConfirm', false);
                        let loader = this.loadingController.create({
                          content: "Enviando sms..."
                        });
                        loader.present();
                        this.confirmService.getRequestSMS().then((data:any)=>{
                          if(data.requestSMS){
                            this.confirmService.sendSMS(id_customer).then((response:any)=>{
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
                          else{
                            this.navCtrl.push( TabsPage ); 
                          }
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
                    console.log('deberia mostrar una alerta');
                    setTimeout(()=>{
                      this.showAlert("Error:","No se ha creado ningun Fluzzer en este dispositivo.");
                    },500);
                  }
                }
              );
            }
          }
          else {
            this.storage.get('userData').then(
              (userData:any)=>{
                if (userData != null && userData != undefined && userData != false){
                  if(userData.Active == 0 && userData.kickout == 1){
                    this.showAlert("Alerta:", "Tu cuenta se encuentra temporalmente suspendida, si crees que se trata de un error, por favor comunicate con soporte.");
                    this.navCtrl.setRoot(LoginPage,{
                      "deeplink": this.link
                    });
                  }
                  else if ( userData.active == 0 && userData.kick_out == 0 ) {
                    this.storage.set('userConfirm', false);
                    this.confirmService.getRequestSMS().then((data:any)=>{
                      if(data.requestSMS){
                        this.navCtrl.setRoot(ConfirmPage,{
                          "deeplink": this.link
                        });
                      }
                      else{
                        this.navCtrl.push( TabsPage ); 
                      }
                    });
                  }
                  else if(userData.active == 1 && userData.kick_out == 0){
                    this.storage.get('userConfirm').then((userConfirm) => {
                      if (userConfirm !== true) {
                        this.confirmService.getRequestSMS().then((data:any)=>{
                          if(data.requestSMS){
                            this.navCtrl.setRoot(ConfirmPage,{
                              "deeplink": this.link
                            });
                          }
                          else{
                            this.navCtrl.push( TabsPage ); 
                          }
                        });
                      }
                      else {
                        this.openDeeplink(this.link);
                      }
                    })
                    .catch(() => {
                      this.storage.set('userConfirm', false);
                        this.confirmService.getRequestSMS().then((data:any)=>{
                          if(data.requestSMS){
                            this.navCtrl.setRoot(ConfirmPage,{
                              "deeplink": this.link
                            });
                          }
                          else{
                            this.navCtrl.push( TabsPage ); 
                          }
                        });
                    });
                  }
                  else {
                    this.validateViewToRoot(this.link);
                  }
                }
                else {
                  this.validateViewToRoot(this.link);
                }
              }
            );
          }
        }
        );
      } catch (e) {
      } finally {
        if(this.link == false){
          setTimeout(()=>{
            this.validateViewToRoot(this.link);
          },1500);
        }
      }
    });
  }
  
  openDeeplink(path:any){
    let deeplink = path.split("/");
    if(deeplink.length == 3){
      if(deeplink[2] == "mi-cuenta"){
        this.navCtrl.setRoot(TabsPage).then(()=>{
          setTimeout(()=>{
            this.tabsService.changeTabInContainerPage(4);
          },1500);
        });
      }
      else{
        let category = deeplink[2].split("-");
        if(Number(category[0])){
          this.openCategoryById(category[0]);
        }
      }
    }
    else if(deeplink.length == 4){
      let product = deeplink[3].split("-");
      if(Number(product[0])){
        this.openProduct(product[0]);
      }
    }
  }
  
  openProduct(product:any){
    this.searchService.openDeeplink(1,product).then((response:any)=>{
      this.searchService.search( response.m_id, '2' ).then((data:any) => {
        if(data.total == 1){
          let productFather:any = data.result['0'];
          this.navCtrl.push(ProductChildPage,{
            manufacturer: response,
            productFather: productFather
          });
        }
        else {
          this.navCtrl.push(ProductFatherPage,{
            manufacturer: response
          });        
        }
      })
      .catch(error =>{
        console.log(error);
      });
    })
    .catch(error =>{
      console.log(error);
    });
  }
  
  openCategoryById( id_category:any ){
    this.searchService.openDeeplink(2,id_category).then((category:any)=>{
      if(category != null){
        this.categoryService.getCategory( 3, id_category ).then(
          (data:any) => {
            if(data != null){
              this.navCtrl.push( CategoryPage, {
                category: category,
                products: data.products
              });
              
            }
          }  
        )
        .catch(function () {
          console.log("Error");
        });
      }
    });
  }
  
  showToast(msg:string, duration:number){
    let toast = this.toastCtrl.create({
        message:  msg,
        duration: duration*1000,
        position: 'middle',
        cssClass: "toast"
    });
    toast.present();
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
            console.log("Nuevo token: ",token),
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
            console.log("data FCM Notification");
            console.log(data);
            this.badge.increase(1);
            if(data.wasTapped){
              //ocurre cuando nuestra app está en segundo plano y hacemos tap en la notificación que se muestra en el dispositivo
              this.badge.clear();
            }else{
              this.badge.clear();
              let title = "Fluz Fluz";
              title = ("title" in data)? data.title : title;
              this.showAlert(data.title, data.text);
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
