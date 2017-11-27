import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonalInformationService } from '../../providers/personalinformation.service';
import { LoginService } from '../../providers/login-service';
import { AlertController } from 'ionic-angular';
import { AnalyticsService } from '../../providers/analytics.service';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [
    LoginService,
    PersonalInformationService,
    AnalyticsService
  ],
})
export class RegisterPage {

  registerForm: FormGroup;
  public enabledSaveButton = false;
  public cities:any;
  public data:any = {};
  
  constructor(
    private alertCtrl: AlertController,
    private loginService: LoginService,
    private personalInformationService: PersonalInformationService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public analytics: AnalyticsService
  ){
    this.data.email = '';
    setTimeout(()=>{ 
      this.data = navParams.get('data');
    }, 100);
    setTimeout(()=>{ 
      if(this.data.email != ''){
        this.setValues();
      }
    }, 500);
      console.log(this.data);
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
      });
  }

  ionViewWillEnter() {
    this.analytics.trackView('RegisterPage');
    this.getCities();
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
      this.registerForm.controls['cod_refer'].valid 
    ) {
      this.enabledSaveButton = true;
    } 
    else {
      this.enabledSaveButton = false;
    }
  }


  getCities(){
    this.personalInformationService.getCities().subscribe(
      success => {
        if(success.status === 200) {
          let response = JSON.parse(success._body);
          this.cities = response;
        }
        else {
          
        }
      },
      error => {
        this.navCtrl.pop();
      }
    );
  }
  
    send(valor) {
        this.enabledSaveButton = false;
        this.loginService.register(valor).subscribe(
            success => {
                if(success.status === 200) {
                    let response = JSON.parse(success._body);
                    if (response.success) {
                        this.enabledSaveButton = true;
                        let alert = this.alertCtrl.create({
                            title: 'Registro completo',
                            subTitle: 'Tu contraseña es tu número de identificación.',
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
                        let alert = this.alertCtrl.create({
                            title: 'Registro incompleto',
                            subTitle: response.error['0'],
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                }
            },
            error => {
                this.enabledSaveButton = true;
                let alert = this.alertCtrl.create({
                    title: 'Registro incompleto',
                    subTitle: 'Se ha producido un error en el registro. Por favor verifica tus datos he intenta de nuevo.',
                    buttons: ['OK']
                });
                alert.present();
            }
        );
    }
 
}
