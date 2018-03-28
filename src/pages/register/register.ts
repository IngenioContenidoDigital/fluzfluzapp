import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonalInformationService } from '../../providers/personalinformation.service';
import { LoginService } from '../../providers/login-service';
import { AlertController } from 'ionic-angular';
import { AnalyticsService } from '../../providers/analytics.service';
import { CountryModalPage } from '../country-modal/country-modal'; 
import { ConfirmService } from '../../providers/confirm.service';
import { ConfirmPage } from '../confirm/confirm';
import { Storage } from '@ionic/storage';

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
  public countriesDir:any;
  public departament:any;
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
    public storage: Storage,
    public viewCtrl: ViewController,
    public analytics: AnalyticsService
  ){
    setTimeout(()=>{ 
      this.data = navParams.get('data');
    }, 100);
    this.registerForm = formBuilder.group({
      'firts_name' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{3,100}$/i)])],
      'user_name' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]{5,100}$/i)])],
      'last_name' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{3,100}$/i)])],
      'email' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]+[.a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]*@[a-z\p{L}0-9]+(?:[.]?[_a-z\p{L}0-9-])*\.[a-z\p{L}0-9]+$/i)])],
      'address' : [null,  Validators.compose([Validators.required])],
      'country' : [null,  Validators.compose([Validators.required])],
      'dpto' : [null,  Validators.compose([Validators.required])],
      'city' : [null,  Validators.compose([Validators.required])],
      'type_identification' : [null,  Validators.compose([Validators.required])],
      'number_identification' : [null, Validators.compose([Validators.required, Validators.pattern(/^[0-9]{5,15}$/i)])],
      'cod_refer' : [null, Validators.compose([Validators.pattern(/^[a-zA-Z0-9\s]{5,50}$/i)])],
      'phoneNumber': [null, Validators.compose([Validators.required, Validators.minLength(6),Validators.pattern('^[0-9]{1,15}$')])],
      'password' : [null,  Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9\s]{6,16}$/i)])],
      'password_confirm' : [null,  Validators.compose([Validators.required])]
    }, {validator: this.matchingPasswords('password', 'password_confirm')});
  }
  
  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    // TODO maybe use this https://github.com/yuyang041060120/ng2-validation#notequalto-1
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }
  
  ionViewWillEnter() {
    this.storage.get('userData').then(
      (userData:any)=>{
        if(userData !== null && userData !== undefined && userData !== false){
          this.storage.get('userConfirm').then(
            (userConfirm: boolean | any)=>{
              if(userData.active == 1 && userConfirm == true){
                this.dismiss(true);
              }
            }
          );
        }
      }
    );
    this.analytics.trackView('RegisterPage');
    this.getCountries();
    this.getDepartament();
    if(this.data.email != '' || this.data.email != 'undefined' || this.data.email){
      this.setValues();
    }
  }
  
  dismiss(value:boolean) {
    this.viewCtrl.dismiss({
      flagPop: value
    });
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
      this.registerForm.controls['country'].valid &&
      this.registerForm.controls['dpto'].valid &&
      this.registerForm.controls['city'].valid &&
      this.registerForm.controls['type_identification'].valid &&
      this.registerForm.controls['number_identification'].valid &&
      this.registerForm.controls['cod_refer'].valid &&
      this.registerForm.controls['phoneNumber'].valid &&
      this.registerForm.controls['password'].valid &&
      this.registerForm.controls['password_confirm'].valid 
    ) {
      if(this.registerForm.controls['password'].value == this.registerForm.controls['password_confirm'].value ){
        this.enabledSaveButton = true;
      }
      else {
        this.enabledSaveButton = false;
      }
    } 
    else {
      this.enabledSaveButton = false;
    }
  }
  
  validateInputCountry(){
    this.registerForm.get('dpto').setValue(null);
    this.registerForm.get('city').setValue(null);
    this.validateInput('');
  }
  
  validateInputDepartament(){
    if(this.registerForm.controls['country'].value == 69){
      this.getCities(this.registerForm.controls['dpto'].value);
    }
  }
  
  getCountries(){
    this.personalInformationService.getCountries().then(
      (response:any) => {
        if(response.success === true) {
          this.countriesDir = response.countries;
        }
        else {
          this.showAlert('Ha ocurrido un error:', 'No se han podido obtener los países. Por favor intenta de nuevo.');
        }
      },
      error => {
        this.showAlert('Ha ocurrido un error:', 'No se han podido obtener los países. Por favor intenta de nuevo.');
        this.navCtrl.pop();
      }
    );
  }
  
  getDepartament(){
    this.personalInformationService.getDepartament().then(
      (response:any) => {
        if(response.success === true) {
          this.departament = response.departament;
        }
        else {
          this.showAlert('Ha ocurrido un error:', 'No se han podido obtener los departamentos. Por favor intenta de nuevo.');
        }
      },
      error => {
        this.showAlert('Ha ocurrido un error:', 'No se han podido obtener los departamentos. Por favor intenta de nuevo.');
        this.navCtrl.pop();
      }
    );
  }

  getCities(dpto){
    let loader = this.loadingController.create({
      content: "Cargando ciudades..."
    });
    loader.present();
    this.personalInformationService.getCitiesByDepartment(dpto).then(
      (response:any) => {
        loader.dismiss();
        if(response.success === true) {
          this.cities = response.cities;
        }
        else {
          this.showAlert('Ha ocurrido un error:', 'No se han podido obtener las ciudades. Por favor intenta de nuevo.');
        }
      },
      error => {
        loader.dismiss();
        this.showAlert('Ha ocurrido un error:', 'No se han podido obtener las ciudades. Por favor intenta de nuevo.');
        this.navCtrl.pop();
      }
    ).catch(()=>{
      loader.dismiss();
    });
  }
  
  sendRandom(valor){
    this.confirmService.sendSMSRandom(this.countries.callingCodes+valor.phoneNumber).then(
      (response:any)=>{
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
        console.log('response');
        console.log(response);
        loader.dismiss();
        if(response.success === true) {
          this.enabledSaveButton = true;
          this.analytics.trackView('RegisterCompletePage');
          let alert = this.alertCtrl.create({
            title: 'Registro completo',
            subTitle: 'Hemos enviado un correo con un link de verificación a tu cuenta de correo, por favor ábrelo con Fluz Fluz App.',
            buttons: [{
              text: 'Ok',
              handler: () => {
                setTimeout(()=>{ this.goToConfrimPage(response.customer); }, 500);
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
  
  public goToConfrimPage(customer:any){
    this.analytics.trackEvent('RegisterPage', 'Registro', 'El usuario se ha registrado');
    this.storage.set('userData', customer).then(()=>{
      this.navCtrl.push( ConfirmPage );
    });
    this.storage.set('cart', '');
    this.storage.set('userConfirm', false);
    this.storage.set('userId', customer.id);
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
