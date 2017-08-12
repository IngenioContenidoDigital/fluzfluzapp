import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { LoadingController, NavController, NavParams, AlertController, Platform, ToastController, ModalController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from '../../providers/confirm.service';
import { ConfirmatedPage } from '../confirmated/confirmated';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { CountryModalPage } from '../country-modal/country-modal'; 

@Component({
  selector: 'page-confirm',
  templateUrl: 'confirm.html',
  providers: [ConfirmService],
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

  tabBarElement: any;
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
  
  constructor( public loadingController: LoadingController, public modalCtrl: ModalController, public platform: Platform, public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, public tabsService: TabsService,  formBuilder: FormBuilder, private confirmService: ConfirmService, public storage: Storage, public alertCtrl: AlertController) {
    this.tabBarElement = document.querySelector('.tabbar .show-tabbar');
    this.confirmForm = formBuilder.group({
      'confirmNumber': [null, Validators.compose([Validators.required, Validators.minLength(6),Validators.pattern('^[0-9]{1,6}$')])]
    });
    
    this.phoneForm = formBuilder.group({
      'phoneNumber': [null, Validators.compose([Validators.required, Validators.minLength(6),Validators.pattern('^[0-9]{1,15}$')])]
    });
        
    platform.registerBackButtonAction(() => {
      let view = this.navCtrl.getActive();
      if (view.component.name == "ConfirmPage") {
        let toast = this.toastCtrl.create({
          message:  'Debes confirmar tu cuenta.',
          duration: 2000,
          position: 'middle',
          cssClass: "toast"
        });
        toast.present();
      }
      else {
        this.navCtrl.pop({});
      }
    });
  }
  
  ionViewWillEnter(){
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
        );
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
      );
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
      );
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
      let data = {
        confirmNumber: valor.confirmNumber,
        id_customer: val.id
      }      
      this.confirmService.confirm(data).subscribe(
        success => {
          loader.dismiss();
          if (success.status === 200){
            this.storage.set('userConfirm', true);
            this.navCtrl.push( ConfirmatedPage );
          }
          else {
            this.showConfirm();
          }          
        },
        //Si hay algun error en el servidor.
        error =>{ 
          console.log(error)
        }
      );
    });
  }

  showConfirm() {
    setTimeout(()=>{ this.textFooter = "¡El número de confirmación ingresado es incorrecto!"; }, 500);
    this.enabledConfirmButton = false;  
	}
  
  getPhone(){
    let loader = this.loadingController.create({
      content: "Cargando..."
    });
    loader.present();
    this.storage.get('userData').then((val) => {
      this.confirmService.getPhone(val.id).then( (data:any)=> {
        loader.dismiss();
        if( data.phone == null || data.phone == undefined || data.phone == 0 || data.phone == '0' ) {
          this.showFormPhone = true;
        }
        else{
          this.phoneNumber = data.formatPhone;
          this.showFormPhone = false;
        }
      });
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
