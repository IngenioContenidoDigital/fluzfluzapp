import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { ViewController, LoadingController, NavController, NavParams, AlertController, Platform, ToastController, ModalController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from '../../providers/confirm.service';
import { ConfirmatedPage } from '../confirmated/confirmated';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { CountryModalPage } from '../country-modal/country-modal'; 
import { AnalyticsService } from '../../providers/analytics.service';
 
@Component({
  selector: 'page-confirm',
  templateUrl: 'confirm.html',
  providers: [
    ConfirmService,
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
export class ConfirmPage {

  confirmForm: FormGroup;
  phoneForm: FormGroup;
  public nextViewConfirm:boolean = false;
  public enabledConfirmButton:boolean = true;
  public enabledPhoneButton:boolean = false;
  public textInfo:string   = "Enviaremos un código de confirmación a tu teléfono móvil a través de SMS para verificar que eres el propietario de esta cuenta.";
  public textButton:string = "CONTINUAR";
  public textFooter:string = "¿De dónde viene este número?";
  public textContact:string = "¿No es tu número? ";
  public showFormPhone:any = false;
  public countries:any = {
    name: 'Colombia',
    callingCodes: '57',
    flag: 'https://restcountries.eu/data/col.svg'
  };
  public phoneNumber:any;
  public showSendAgain:any = false;
  public deeplink:any = false;
  public paramsGet:any = [
    {id_customer: null, sendSMS: null}
  ];
  constructor(
    public loadingController: LoadingController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public platform: Platform,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public tabsService: TabsService,
    public formBuilder: FormBuilder,
    private confirmService: ConfirmService,
    public storage: Storage,
    public alertCtrl: AlertController,
    public analytics: AnalyticsService
  ) {
    this.paramsGet = (navParams.get("paramsGet") != undefined) ? navParams.get("paramsGet"): this.paramsGet;
    this.deeplink = (navParams.get("deeplink") != undefined) ? navParams.get("deeplink"): this.deeplink;
    this.confirmForm = formBuilder.group({
      'confirmNumber': [null, Validators.compose([Validators.required, Validators.minLength(6),Validators.pattern('^[0-9]{1,6}$')])]
    });
    
    this.phoneForm = formBuilder.group({
      'phoneNumber': [null, Validators.compose([Validators.required, Validators.minLength(6),Validators.pattern('^[0-9]{1,15}$')])]
    });
    platform.registerBackButtonAction(() => {
      setTimeout(()=>{ 
        let view = this.navCtrl.getActive();
        if (view.component.name == "ConfirmPage") {
          this.showToast('Debes confirmar tu cuenta.', 2);
        }
      }, 500);
    });
  }
  
  showToast(message:string, duration: number){
    let toast = this.toastCtrl.create({
      message:  message,
      duration: duration*1000,
      position: 'middle',
      cssClass: "toast"
    });
    toast.present();
  }
  
  dismiss(value:boolean) {
    this.viewCtrl.dismiss({
      flagPop: value
    });
  }
  
  ionViewWillEnter(){
    this.storage.get('userData').then((userData:any) => {
      this.storage.get('userConfirm').then((userConfirm:any) => {
        if( userData.active == 0 && userData.kick_out == 0 ){
          this.textInfo = 'Estas a un paso de ser un Fluzzer, solo debes abrir el enlace de confirmación que enviamos a tu correo <b class="email-new-user">'+userData.email+'</b> y luego ingresar el código de verificación que te llegará a través de sms.';
          this.textButton = "CONFIRMAR";
          this.textFooter = "¿No eres tu?";
          this.nextViewConfirm = true;
        }
        else if(userData.active == 1 && userData.kick_out == 0 && userConfirm == true){
          this.dismiss(true);
        }
        else{
          this.getPhone();
        }
      });
    });
    this.analytics.trackView('ConfirmPage');
    this.tabsService.hide();
  }
  
  optionFooter(){
     this.storage.get('userData').then((userData:any) => {
      if( userData.active == 0 && userData.kick_out == 0 ){
        this.storage.get('userData').then((userData:any) => {
          let alert = this.alertCtrl.create({
            title: "¿No eres tu?",
            message: "Estas intentando ingresar con el usuario "+userData.email+", ¿Deseas ingresar con otro usuario?",
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel'
              },
              {
                text: 'Aceptar',
                handler: () => {
                  this.storage.set('newUser', false);
                  this.storage.set('userData', null);
                  this.storage.set('userId', null);
                  this.storage.set('userConfirm', false);
                  setTimeout(()=>{this.navCtrl.setRoot(LoginPage);},500);
                }
              }
            ]
          });
          alert.present();
        });
      }
    });
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }
  
  public goTo(){
    this.tabsService.changeTabInContainerPage(0);
    this.navCtrl.setRoot(TabsPage);
  }
  
  //Activa la siguiente vista
  nextView() {
    if ( !this.nextViewConfirm ){
      let loader = this.loadingController.create({
        content: "Validando..."
      });
      loader.present();
      this.storage.get('userData').then((val) => {
        this.confirmService.sendSMS(val.id).then(
          (data:any) =>{
            loader.dismiss();
            this.showSendAgain = true;
            this.nextViewConfirm = true;
            this.enabledConfirmButton = false;    
            this.textInfo = "Introduce el código de 6 dígitos que se envió a tu teléfono móvil registrado a través de SMS.";
            this.textButton = "CONFIRMAR";
            this.textContact = "¿Tienes algún problema? ";
          }
        )
        .catch(function () {
          console.log("Error");
        });
      })
      .catch(function () {
        console.log("Error");
      });
    }
    else {
      if (this.confirmForm.controls['confirmNumber'].valid){
        this.confirm(this.confirmForm.value);
      }
    }
  }
  
  sendSMSAgain(){
    let loader = this.loadingController.create({
      content: "Enviando sms..."
    });
    loader.present();
    this.storage.get('userData').then((val) => {
      this.confirmService.sendSMS(val.id).then(
      (data:any) => {
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message:  'Sé envió nuevamente el código.',
          duration: 2000,
          position: 'middle',
          cssClass: "toast"
        });
        toast.present();
      }
      )
      .catch(function () {
        console.log("Error");
      });
    })
    .catch(function () {
      console.log("Error");
    });
  }  
  
  validatePhoneNumber(event:any) {
    this.phoneForm.controls['phoneNumber'].valid ? this.enabledPhoneButton = true : this.enabledPhoneButton = false;
  }
  
  savePhone(){
    let loader = this.loadingController.create({
      content: "Enviando..."
    });
    loader.present();
    this.storage.get('userData').then((val) => {
      this.confirmService.setPhone( val.id, this.countries.callingCodes + this.phoneForm.value.phoneNumber ).then( 
        (data:any) =>{
          loader.dismiss();
          if(data.success == true){
            if(data.error.error == 0){
              setTimeout(()=>{ this.getPhone(); }, 500);
            }
            else {
              this.showAlert('Ha ocurrido un error:', data.error.msg);
            }
          }
          else {
            this.showAlert('Ha ocurrido un error:','Ha ocurrido un error en el servidor, por favor intenta nuevamente.')
          }
        }
      )
      .catch(function () {
        console.log("Error");
      });
    })
    .catch(function () {
      console.log("Error");
    });
  }
  
  validateConfirmNumber(event:any) {
    this.confirmForm.controls['confirmNumber'].valid ? this.enabledConfirmButton = true : this.enabledConfirmButton = false;
    this.textFooter = "¿De dónde viene este número?";
  }
  
  confirm(valor:any) {
    let loader = this.loadingController.create({
      content: "Validando..."
    });
    loader.present();
    this.storage.get('userData').then((val) => {
      let confirmPhoneData:any = {
        confirmNumber: valor.confirmNumber,
        id_customer: val.id
      }      
      this.confirmService.confirm(confirmPhoneData).then(
        (response:any) => {
          loader.dismiss();
          if(response.error == 0){
            this.storage.set('userConfirm', true);
            this.navCtrl.push( ConfirmatedPage, { "deeplink": this.deeplink } );
            val.active = 1;
            this.storage.set("userData", val);
          }
          else {
            this.showAlert("Ha ocurrido un error:", response.message);
          }
        },
        //Si hay algun error en el servidor.
        error =>{
          loader.dismiss();
          console.log(error)
        }
      );
    })
    .catch(function () {
      loader.dismissAll();
      console.log("Error");
    });
  }

  showConfirm() {
    setTimeout(()=>{ this.textFooter = "¡El número de confirmación ingresado es incorrecto!"; }, 500);
    this.enabledConfirmButton = false;  
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
  
  getPhone(){
    let loader = this.loadingController.create({
      content: "Cargando..."
    });
    loader.present();
    this.storage.get('userData').then(
      (userData:any) => {
        this.confirmService.getPhone(userData.id).then(
          (phoneData:any)=> {
            loader.dismiss();
            if( phoneData.phone == null || phoneData.phone == undefined || phoneData.phone == 0 || phoneData.phone == '0' ) {
              this.showFormPhone = true;
            }
            else{
              this.phoneNumber = phoneData.formatPhone;
              this.showFormPhone = false;
            }
          }
        )
        .catch(function () {
          console.log("Error");
        });
      }
    )
    .catch(function () {
      console.log("Error");
    });
  }
    
  openModalCountry(){
    let countryModal = this.modalCtrl.create( CountryModalPage );
    countryModal.onDidDismiss(data => {
      if(data !== undefined && data !== null){
        this.countries.name = data.name;
        this.countries.flag = data.flag;
        this.countries.callingCodes = data.callingCodes;
      }
    });
    countryModal.present();
  }
}
