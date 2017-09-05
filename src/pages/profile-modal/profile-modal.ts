import { Component } from '@angular/core';
import { ModalController, ViewController, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MyAccountService } from '../../providers/myAccount.service';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { NetworkService } from '../../providers/network.service';
import { SearchService } from '../../providers/search.service';
import { ProductChildPage } from '../product-child/product-child';
import { ProductFatherPage } from '../product-father/product-father';
import { MessageModalPage } from '../message-modal/message-modal';

@Component({
  selector: 'page-profile-modal',
  templateUrl: 'profile-modal.html',
  providers: [MyAccountService, NetworkService, SearchService]
})
export class ProfileModalPage {
  invitationForm: FormGroup;
  public customer:any = [];
  public invitated:any = [];
  public activity:any = [];
  public data:any;
  public enabledInvitationButton = false;
  public showInvitationForm:any = false;
  
  constructor( public modalCtrl: ModalController, public viewCtrl: ViewController, public searchService: SearchService, public toastCtrl: ToastController, public network: NetworkService, public loadingController: LoadingController, public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public myAccount: MyAccountService, formBuilder: FormBuilder ) {
    this.data = navParams.get('customer');
    this.invitationForm = formBuilder.group({
      'firtsname' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]{3,100}$/i)])],
      'lastname' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]{3,100}$/i)])],
      'email' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]+[.a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]*@[a-z\p{L}0-9]+(?:[.]?[_a-z\p{L}0-9-])*\.[a-z\p{L}0-9]+$/i)])],
    });
  }

  ionViewWillEnter(){
    setTimeout(()=>{
      this.getCustomerData();
      this.getInvitationData();
      this.getActivityNetwork();
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
  
  getActivityNetwork(){
    let loader = this.loadingController.create({
      content: "Cargando..."
    });
    loader.present();
    this.myAccount.getActivityNetworkProfile( this.data.id ).then(
      (data:any)=>{
        loader.dismiss();
        this.activity = JSON.parse(data);
      }
    );
  }
  
  toggleInvitation() {
    this.invitationForm.reset();
    setTimeout(()=>{ this.showInvitationForm = this.showInvitationForm ? false : true; }, 500);
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
  
  openProduct(item:any){
    let manufacturer:any = {};
    manufacturer.image_manufacturer = item.img;
    manufacturer.m_name = item.name_product;
    manufacturer.m_id = item.id_manufacturer;
    
    this.searchService.search( item.id_manufacturer, '2' ).then((data:any) => {
      if(data.total == 1){
        let productFather:any = data.result['0'];
        this.navCtrl.push(ProductChildPage,{
          manufacturer: manufacturer,
          productFather: productFather
        });
      }
      else {
        this.navCtrl.push(ProductFatherPage,{
          manufacturer: manufacturer
        });        
      }
    });
  }
  
  dismiss(send:any = false) {
    this.viewCtrl.dismiss( { send: send } );
  }
  
  openCustomer(item:any){
    if(item.status == "Confirmado"){
      this.dismiss(item);
    }
    else if (item.status == "Pendiente") {
      let toast = this.toastCtrl.create({
        message: "Este Fluzzer aún no ha aceptado la invitación.",
        position: 'middle',
        duration: 2000,
      });
      toast.present();
    }
  }
  
  sendMessage(item:any){
    let messageModal = this.modalCtrl.create( MessageModalPage, { destiny: item } );
    messageModal.onDidDismiss(data => {
    });
    messageModal.present();
  }

}
