import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MyAccountService } from '../../providers/myAccount.service';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { NetworkService } from '../../providers/network.service';

@Component({
  selector: 'page-profile-modal',
  templateUrl: 'profile-modal.html',
  providers: [MyAccountService, NetworkService]
})
export class ProfileModalPage {
  invitationForm: FormGroup;
  public customer:any = [];
  public invitated:any = [];
  public data:any;
  public enabledInvitationButton = false;
  public showInvitationForm:any = false;
  
  constructor( public toastCtrl: ToastController, public network: NetworkService, public loadingController: LoadingController, public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public myAccount: MyAccountService, formBuilder: FormBuilder ) {
    this.data = navParams.get('customer');
    
    this.invitationForm = formBuilder.group({
      'firtsname' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]{3,100}$/i)])],
      'lastname' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]{3,100}$/i)])],
      'email' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]+\.[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i)])],
    });
  }

  ionViewWillEnter(){
    setTimeout(()=>{
      this.getCustomerData();
      this.getInvitationData();
    }, 500);
  }
  
  getCustomerData(){
    let loader = this.loadingController.create({
      content: "Cargando..."
    });
    loader.present();
    this.storage.get('userData').then((val) => {
      this.myAccount.getProfile( val.id, this.data.id ).then(
        (data:any)=>{
          loader.dismiss();
          this.customer = JSON.parse(data);
        }
      );
    });
  }
  
  getInvitationData() {
    let loader = this.loadingController.create({
      content: "Cargando..."
    });
    loader.present();
    this.myAccount.getInviteduserForProfile( this.data.id ).then(
      (data:any)=>{
        loader.dismiss();
        this.invitated = JSON.parse(data);
      }
    );
  }
  
  toggleInvitation() {
    this.showInvitationForm = this.showInvitationForm ? false : true;
    this.invitationForm.reset();
  }
  
  validateInput(event:any) {
    if (
      this.invitationForm.controls['firtsname'].valid &&
      this.invitationForm.controls['lastname'].valid &&
      this.invitationForm.controls['email'].valid
    ) {
      this.enabledInvitationButton = true;
    } 
    else {
      this.enabledInvitationButton = false;
    }
  }
  
  sendInvitation( formData:any ){
    let loader = this.loadingController.create({
      content: "Enviando..."
    });
    loader.present();
    if (this.invitationForm.controls['email'].valid && this.invitationForm.controls['firtsname'].valid && this.invitationForm.controls['lastname'].valid) {
//          let obj = JSON.stringify(formData);
          this.network.sendInvitation(this.customer.id, formData).then(
            (data:any) => {
              loader.dismiss();
              let d = JSON.parse(data);
              let errorMessage = '';
              if( d.error < 4 ){
                setTimeout(()=>{ this.getInvitationData(); }, 500);
                this.toggleInvitation();
              }
              if(d.error == '0'){
                errorMessage = 'Invitación enviada correctamente.';
              }
              else {
                switch (d.error){
                  case '1': {
                    errorMessage = 'Este Fluzzer no tiene invitaciones disponibles.';
                    break;
                  }
                  case '2': {
                    errorMessage = 'Nombre o apellido incorrecto.';
                    break;
                  }
                  case '3': {
                    errorMessage = 'El correo ya se encuentra en uso.';
                    break;
                  }
                  default: {
                    errorMessage = 'Ha ocurrido un error, intenta de nuevo.';
                    break;
                  }
                }
              }
              let toast = this.toastCtrl.create({
                message: errorMessage,
                position: 'middle',
                duration: 2000,
              });
              toast.present();
            }
          );
        
    }
    
  }
  

}
