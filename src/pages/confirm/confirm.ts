import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { LoadingController, NavController, NavParams, AlertController, Platform, ToastController, ModalController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from '../../providers/confirm.service';
import { ConfirmatedPage } from '../confirmated/confirmated';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
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
  
  constructor(
    public loadingController: LoadingController,
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
    this.confirmForm = formBuilder.group({
      'confirmNumber': [null, Validators.compose([Validators.required, Validators.minLength(6),Validators.pattern('^[0-9]{1,6}$')])]
    });
    
    this.phoneForm = formBuilder.group({
      'phoneNumber': [null, Validators.compose([Validators.required, Validators.minLength(6),Validators.pattern('^[0-9]{1,15}$')])]
    });
        
    platform.registerBackButtonAction(() => {
      let view = this.navCtrl.getActive();
      if (view.component.name == "ConfirmPage") {
        this.showToast('Debes confirmar tu cuenta.', 2);
      }
      else {
        this.navCtrl.pop({});
      }
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
  
  ionViewWillEnter(){
    this.analytics.trackView('ConfirmPage');
    this.tabsService.hide();
    this.getPhone();
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
        data =>{
          loader.dismiss();
          if(data == true){
            setTimeout(()=>{ this.getPhone(); }, 500);
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
  
  confirm (valor:any) {
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
            this.navCtrl.push( ConfirmatedPage );
          }
          else {
            this.showAlert("Ha ocurrido un error:", response.message);
          }
        },
        //Si hay algun error en el servidor.
        error =>{
          console.log(error)
        }
      );
    })
    .catch(function () {
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
