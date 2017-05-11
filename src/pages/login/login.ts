import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { LoginService } from '../../providers/login-service';
import { ConfirmPage } from '../confirm/confirm';
import { TabsService } from '../../providers/tabs.service';

/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
//@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [LoginService]
})
export class LoginPage {
  public nextLoginButton:boolean;
  public enabledLoginButton:boolean;
  public userData:any;
  public userId:any;
  public userConfirm:any;

  tabBarElement: any;
  loginForm: FormGroup;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder, private loginService:LoginService, public storage: Storage, public alertCtrl: AlertController, public tabsService: TabsService) {
    this.tabBarElement = document.querySelector('.tabbar .show-tabbar');
  	this.loginForm = formBuilder.group({
      'email' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]+\.[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])],
      'pwd': [null, Validators.required]
    });
  }
  
  ionViewWillEnter(){
    this.tabsService.hide();
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }
  
  //Según lo que recibe, manda a alguna página.
  public goTo( valor:any ){
    if ( valor == 'confirmPage' ){
      this.storage.set('userConfirm', false);
      this.navCtrl.push( ConfirmPage );
    }
    else if ( valor == 'welcomePage'){
    }
    else {
      this.navCtrl.pop();
    }
  }
    
  //Valida que los dos campos sean llenados para activar el boton login
  validateInputLogin(event:any) {
    if(this.loginForm.controls['email'].valid && this.loginForm.controls['pwd'].valid) {
      this.enabledLoginButton = true;
    }
    else {
      this.enabledLoginButton = false;
    }      
  }
  
  //Hace el login en la aplicación
  login(valor:any):void {
  	this.loginService.postLogin(valor).subscribe(
     	success => {
        if(success.status === 200) {
          
          //Obtiene el id de algún antiguo usuario.
          this.storage.get('userId').then((val) => {
            //Valida si hay o no usuario antiguo.
            if ( val != undefined && val != null ){
              //Guarda el id antiguo y la respuesta del servidor.
              this.userId = val;
              this.userData = JSON.parse(success._body);
              
              //Valida si son el mismo usuario. (El id antiguo y el nuevo.)
              if ( this.userId === this.userData.id ) {
                this.storage.set('userData', JSON.parse(success._body));
                //Si aún no está confirmado, manda a confirmar la cuenta.
                this.storage.get('userConfirm').then((val) => {
                  if ( val !== true ){
                    this.goTo("confirmPage");
                  }
                  else {
                    //manda a home.
                    this.goTo("");                    
                  }
                });
              }
              //Si no son iguales, manda a confirmar la cuenta.
              else {
                this.storage.set('userData', JSON.parse(success._body));
                this.goTo("confirmPage");
                this.setUserId(success._body);
              }
            }
            //si no hay antiguo, manda a confirmar la cuenta.
            else {
              this.storage.set('userData', JSON.parse(success._body));
              this.goTo("confirmPage");
              this.setUserId(success._body);
            }
          });
        }
        //Si no están bien los datos le muestra una alerta
        else {
          this.showConfirm();
        }
      },
      //Si hay algun error en el servidor.
      error =>{ 
        console.log(error)
      }
    );
  }
    
  //Guarda el id de usurio en el localStorage
  setUserId(value:any):any{
    this.userData = JSON.parse(value);
    this.storage.set('userId', this.userData.id );
  }
    
  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Error de autenticación',
      message: 'La dirección de correo electrónico y la contraseña que has introducido no coinciden.',
      buttons: [
        {
          text: 'Volver a intentar',
          handler: () => {
            console.log('Disagree clicked');
          }
        }
      ]
    });
    confirm.present();
	}
  
  

}