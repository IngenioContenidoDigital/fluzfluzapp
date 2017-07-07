import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ToastController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmService } from '../../providers/confirm.service';
import { ConfirmatedPage } from '../confirmated/confirmated';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
 
@Component({
  selector: 'page-confirm',
  templateUrl: 'confirm.html',
  providers: [ConfirmService]
})
export class ConfirmPage {

  tabBarElement: any;
  confirmForm: FormGroup;
  public nextViewConfirm:boolean;
  public enabledConfirmButton:boolean = true;
  public textInfo:string   = "Enviamos un código de confirmación a tu teléfono móvil a través de SMS para verificar que eres el propietario de esta cuenta.";
  public textButton:string = "CONTINUAR";
  public textFooter:string = "¿De dónde viene este número?";
  public textContact:string = "¿No es tu número? ";
  
  constructor( public platform: Platform, public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, public tabsService: TabsService,  formBuilder: FormBuilder, private confirmService: ConfirmService, public storage: Storage, public alertCtrl: AlertController) {
    this.tabBarElement = document.querySelector('.tabbar .show-tabbar');
    this.confirmForm = formBuilder.group({
      'confirmNumber': [null, Validators.compose([Validators.required, Validators.minLength(6),Validators.pattern('^[0-9]{1,6}$')])]
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
    this.nextViewConfirm = true;
    if (this.confirmForm.controls['confirmNumber'].valid){
      this.confirm(this.confirmForm.value);
    }
    this.enabledConfirmButton = false;    
    this.textInfo = "Introduce el código de 6 dígitos que se envió a tu teléfono móvil registrado a través de SMS.";
    this.textButton = "CONFIRMAR";
    this.textContact = "¿Teniendo problemas? ";
  }
  
  validateConfirmNumber(event:any) {
    this.confirmForm.controls['confirmNumber'].valid ? this.enabledConfirmButton = true : this.enabledConfirmButton = false;
    this.textFooter = "¿De dónde viene este número?";
  }
  
  confirm (valor:any) {
    this.confirmService.confirm(valor).subscribe(
     	success => {
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
  }
  
  
  showConfirm() {
    this.textFooter = "¡El número de confirmación ingresado es incorrecto!";
    this.enabledConfirmButton = false;  
	}  
}
