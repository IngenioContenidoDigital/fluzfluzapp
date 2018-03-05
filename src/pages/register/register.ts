import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonalInformationService } from '../../providers/personalinformation.service';
import { LoginService } from '../../providers/login-service';
import { AlertController } from 'ionic-angular';
import { AnalyticsService } from '../../providers/analytics.service';
import { CountryModalPage } from '../country-modal/country-modal'; 
import { ConfirmService } from '../../providers/confirm.service';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [
    LoginService,
    ConfirmService,
    PersonalInformationService,
    AnalyticsService
  ],
})
export class RegisterPage {

  registerForm: FormGroup;
  public enabledSaveButton = false;
  public cities:any;
  public data:any = {email: ''};
  public countries:any = {
    name: 'Colombia',
    callingCodes: '57',
    flag: 'https://restcountries.eu/data/col.svg'
  };
  
  constructor(
    private alertCtrl: AlertController,
    private confirmService: ConfirmService,
    private loginService: LoginService,
    public loadingController: LoadingController,
    private personalInformationService: PersonalInformationService,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public analytics: AnalyticsService
  ){
    setTimeout(()=>{ 
      this.data = navParams.get('data');
    }, 100);
    this.registerForm = formBuilder.group({
      'firts_name' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{5,100}$/i)])],
      'user_name' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]{5,100}$/i)])],
      'last_name' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{5,100}$/i)])],
      'email' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]+[.a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]*@[a-z\p{L}0-9]+(?:[.]?[_a-z\p{L}0-9-])*\.[a-z\p{L}0-9]+$/i)])],
      'address' : [null,  Validators.compose([Validators.required])],
      'city' : [null,  Validators.compose([Validators.required])],
      'type_identification' : [null,  Validators.compose([Validators.required])],
      'number_identification' : [null, Validators.compose([Validators.required, Validators.pattern(/^[0-9]{5,15}$/i)])],
      'cod_refer' : [null, Validators.compose([Validators.pattern(/^[a-zA-Z0-9\s]{5,50}$/i)])],
      'phoneNumber': [null, Validators.compose([Validators.required, Validators.minLength(6),Validators.pattern('^[0-9]{1,15}$')])]
    });
  }

  ionViewWillEnter() {
    this.analytics.trackView('RegisterPage');
    this.getCities();
    if(this.data.email != '' || this.data.email != 'undefined' || this.data.email){
      this.setValues();
    }
  }
  
  setValues(){
    this.registerForm.get('firts_name').setValue(this.data.firts_name);
    this.registerForm.get('last_name').setValue(this.data.last_name);
    this.registerForm.get('email').setValue(this.data.email);
  }
  
  
  validateInput(event:any) {
    if (
      this.registerForm.controls['firts_name'].valid &&
      this.registerForm.controls['last_name'].valid &&
      this.registerForm.controls['user_name'].valid &&
      this.registerForm.controls['email'].valid &&
      this.registerForm.controls['address'].valid &&
      this.registerForm.controls['city'].valid &&
      this.registerForm.controls['type_identification'].valid &&
      this.registerForm.controls['number_identification'].valid &&
      this.registerForm.controls['cod_refer'].valid &&
      this.registerForm.controls['phoneNumber'].valid
    ) {
      this.enabledSaveButton = true;
    } 
    else {
      this.enabledSaveButton = false;
    }
  }


  getCities(){
    this.personalInformationService.getCities().then(
      (response:any) => {
        if(response.success === true) {
          this.cities = response.cities;
        }
        else {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'No se han podido obtener las ciudades. Por favor intenta de nuevo.',
            buttons: ['OK']
          });
          alert.present();
        }
      },
      error => {
        this.navCtrl.pop();
      }
    );
  }
  
  sendRandom(valor){
    this.confirmService.sendSMSRandom(this.countries.callingCodes+valor.phoneNumber).then(
      (response:any)=>{
        console.log('response');
        console.log(response);
        if(response.success){
          if(response.error == 0){
            this.showRandomConfirm(response.numberConfirm);
          }
          else{
            this.showAlert('Ha ocurrido un error:','No se ha podido enviar el sms, por favor intenta nuevamente.');
          }
        }
        else {
          this.showAlert('Ha ocurrido un error:','No se ha podido enviar el sms, por favor intenta nuevamente.');
        }
      }
    );
  }
  
  showRandomConfirm(numberConfirm:any){
    let alert = this.alertCtrl.create({
      title: 'CONFIRMAR',
      message: 'Hemos enviado un código de confirmación por SMS a tu número de celular.',
      inputs: [
        {
          name: 'smsConfirm',
          placeholder: 'Código de confirmación',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Reenviar Código',
          handler: () => {
            this.sendRandom(this.registerForm.value);
          }
        },
        {
          text: 'Confirmar',
          handler: data => {
            if (data.smsConfirm == numberConfirm) {
              // CONFIRMADO
              this.send(this.registerForm.value);
            } else {
              // NO CONFIRMADO
            this.showAlert("Error:","El código no coincide con el enviado por SMS, por favor intenta nuevamente.");
            }
          }
        }
      ]
    });
    alert.present();
  }
  
  send(valor) {
    let loader = this.loadingController.create({
      content: "Cargando..."
    });
    loader.present();
    valor.phone = this.countries.callingCodes+valor.phoneNumber;
    this.enabledSaveButton = false;
    this.loginService.register(valor).then(
      (response:any) => {
        loader.dismiss();
        if(response.success === true) {
          this.enabledSaveButton = true;
          let alert = this.alertCtrl.create({
            title: 'Registro completo',
            subTitle: 'Hemos enviado un correo de verificación de tu cuenta.',
            buttons: [{
              text: 'Ok',
              handler: () => {
                setTimeout(()=>{ this.navCtrl.pop() }, 500);
              }
            }]
          });
          alert.present();
        } else {
          this.enabledSaveButton = true;
          this.showAlert('Registro incompleto',response.error['0']);
        }
      },
      error => {
        loader.dismiss();
        this.enabledSaveButton = true;
        this.showAlert('Registro incompleto','Se ha producido un error en el registro. Por favor verifica tus datos he intenta de nuevo.');
      }
    )
    .catch(function () {
      loader.dismiss();
      console.log('error');
    });
  }
  
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
