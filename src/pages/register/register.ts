import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonalInformationService } from '../../providers/personalinformation.service';
import { LoginService } from '../../providers/login-service';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [ LoginService, PersonalInformationService ],
})
export class RegisterPage {

  registerForm: FormGroup;
  public enabledSaveButton = false;
  public cities:any;
  constructor( private alertCtrl: AlertController, private loginService: LoginService, private personalInformationService: PersonalInformationService, public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder) {
    this.registerForm = formBuilder.group({
      'firts_name' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]{5,100}$/i)])],
      'user_name' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]{5,100}$/i)])],
      'last_name' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]{5,100}$/i)])],
      'email' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]+\.[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])],
      'phone' : [null, Validators.compose([Validators.required, Validators.pattern(/^[0-9]{10}$/i)])],
      'date' : [null, Validators.compose([Validators.required])],
      'address' : [null,  Validators.compose([Validators.required])],
      'address2' : [null,  Validators.compose([Validators.required])],
      'city' : [null,  Validators.compose([Validators.required])],
      'type_identification' : [null,  Validators.compose([Validators.required])],
      'number_identification' : [null, Validators.compose([Validators.required, Validators.pattern(/^[0-9]{5,15}$/i)])]
    });
  }

  ionViewWillEnter() {
    this.getCities();
  }
  
  
  validateInput(event:any) {
    if (
      this.registerForm.controls['firts_name'].valid &&
      this.registerForm.controls['last_name'].valid &&
      this.registerForm.controls['user_name'].valid &&
      this.registerForm.controls['email'].valid &&
      this.registerForm.controls['phone'].valid &&
      this.registerForm.controls['date'].valid &&
      this.registerForm.controls['address'].valid &&
      this.registerForm.controls['address2'].valid &&
      this.registerForm.controls['city'].valid &&
      this.registerForm.controls['type_identification'].valid &&
      this.registerForm.controls['number_identification'].valid
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
    this.loginService.register(valor).subscribe(
     	success => {
        if(success.status === 200) {
          let response = JSON.parse(success._body);
          console.log('response');
          console.log(response);
          if (response.success){
            let alert = this.alertCtrl.create({
              title: 'Registro completo',
              subTitle: 'Tu contraseña es tu número de identificación.',
              buttons: [{
                text: 'Ok',
                handler: () => {
                  alert.dismiss();
                  this.navCtrl.pop();
                }
              }]
            });
            alert.present();
            console.log('todo bien');
          }
          else {
            let alert = this.alertCtrl.create({
              title: 'Error:',
              subTitle: 'Ha ocurrido un error en tu registro, por favor intenta de nuevo.',
              buttons: ['OK']
            });
            alert.present();
            console.log('todo mal');
            console.log(response.error);
          }
        }
      },
      //Si hay algun error en el servidor.
      error =>{ 
        let alert = this.alertCtrl.create({
          title: 'Error:',
          subTitle: 'Ha ocurrido un error en tu registro, por favor intenta de nuevo.',
          buttons: ['OK']
        });
        alert.present();
        console.log(error)
      }
    );
  }
 
}
