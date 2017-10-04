import { Component, trigger, style, animate, state, transition  } from '@angular/core';
import { ViewController,ModalController,NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { NetworkService } from '../../providers/network.service';
import { MyAccountService } from '../../providers/myAccount.service';
import { ToastController } from 'ionic-angular';
import { MessageModalPage } from '../message-modal/message-modal';
import { AnalyticsService } from '../../providers/analytics.service';
import { CountryModalPage } from '../country-modal/country-modal';
import { BrowserTab } from '@ionic-native/browser-tab';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ProfileModalPage } from '../profile-modal/profile-modal';

@Component({
  selector: 'page-invitation-third-modal',
  templateUrl: 'invitation-third-modal.html',
  providers: [
    NetworkService,
    MyAccountService,
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
export class InvitationThirdModalPage {
  
  public enabledLoginButton:boolean;
  public customer:any = [];
  public countMy:any;
  public phoneWhatsapp:any;
  public enabledInvitationButton:any = false;
  public showInvitationForm:any = false;
  public countries:any = {
    name: 'Colombia',
    callingCodes: '57',
    flag: 'https://restcountries.eu/data/col.svg'
  };
  invitationForm: FormGroup;  

  constructor(
    private browserTab: BrowserTab,
    private iab: InAppBrowser,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    public myAccount: MyAccountService,
    public toastCtrl: ToastController,
    public network: NetworkService,
    public storage: Storage,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public analytics: AnalyticsService
  ) {
    this.invitationForm = formBuilder.group({
      'firtsname' : [ null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]{3,100}$/i)])],
      'lastname'  : [ null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]{3,100}$/i)])],
      'email'     : [ null, Validators.compose([Validators.required, Validators.pattern(/^[a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]+[.a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]*@[a-z\p{L}0-9]+(?:[.]?[_a-z\p{L}0-9-])*\.[a-z\p{L}0-9]+$/i)])],
      'whatsapp'  : [ false, Validators.compose([Validators.minLength(1),Validators.pattern('^[0-9]{1,4}$')]) ],
      'country'   : [ this.countries.callingCodes ],
      'telephone' : [ null, Validators.compose([Validators.minLength(6),Validators.pattern('^[0-9]{1,15}$')])] 
    });
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('InvitationThirdModalPage');
  }
  
  ionViewDidLoad() {
    this.getUsersWithInvitations();
  }
  
  getUsersWithInvitations() {
    let loader = this.loadingController.create({
      content: "Cargando..."
    });
    loader.present();
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.network.findInvitation(val.id).then(
          (data:any) => {
            loader.dismiss();
            var data = JSON.parse(data);
            this.customer = data;
          }
        );
      }
    });
  }
  
  openCustomer(item:any){
    let messageModal = this.modalCtrl.create( ProfileModalPage, { customer: item } );
    messageModal.onDidDismiss(data => {
      if(data){
        this.openCustomer(data.send);
      }
    });
    messageModal.present();
  }
  
  sendMessage(item:any){
    let messageModal = this.modalCtrl.create( MessageModalPage, { destiny: item } );
    messageModal.onDidDismiss(data => {
    });
    messageModal.present();
  }
  
  showInvitation(item:any) {
    this.invitationForm.reset();
    setTimeout(()=>{ this.showInvitationForm = this.showInvitationForm == item.id ? false : item.id;  }, 200);
  }
  
  updateWhatsapp(){
    this.invitationForm.get('whatsapp').setValue( this.invitationForm.value['whatsapp'] ? false : true );
  }
  
  validateInput(event:any) {
    if (
      this.invitationForm.controls['firtsname'].valid &&
      this.invitationForm.controls['lastname'].valid &&
      this.invitationForm.controls['email'].valid 
    ) {
      if( this.invitationForm.value['whatsapp'] ){
        this.invitationForm.controls['telephone'].valid ? this.enabledInvitationButton = true : this.enabledInvitationButton = false;
      }
      this.enabledInvitationButton = true;
    } 
    else {
      this.enabledInvitationButton = false;
    }
  }
  
  sendInvitation( item:any, formData:any ){
    let loader = this.loadingController.create({
      content: "Enviando..."
    });
    loader.present();
    if (this.invitationForm.controls['email'].valid && this.invitationForm.controls['firtsname'].valid && this.invitationForm.controls['lastname'].valid) {
      if( this.invitationForm.value['whatsapp'] ){
        if( this.invitationForm.controls['telephone'].valid ) {
          this.phoneWhatsapp = this.countries.callingCodes + this.invitationForm.value['telephone'];
        }
      }
      this.network.sendInvitation(item.id, formData, this.phoneWhatsapp).then(
        (data:any) => {
          loader.dismiss();
          let d = JSON.parse(data);
          let errorMessage = '';
          if( d.error < 4 ){
            setTimeout(()=>{ this.getUsersWithInvitations(); }, 500);
            this.showInvitation(false);
          }
          if(d.error == '0'){
            this.openUrl(d.url);
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
    else {
      let toast = this.toastCtrl.create({
        message: 'Uno o más datos no son correctos',
        position: 'middle',
        duration: 2000,
      });
      toast.present();
    }
  }
  
  openModalCountry(){
    let countryModal = this.modalCtrl.create( CountryModalPage );
    countryModal.onDidDismiss(data => {
      if(data !== undefined && data !== null){
        this.countries.name = data.name;
        this.countries.flag = data.flag;
        this.countries.callingCodes = data.callingCodes;
      }
      setTimeout(()=>{ this.validateInput(true); }, 500);
    });
    countryModal.present();
  }
  
  openUrl(url:string){
    this.browserTab.isAvailable().then((
      isAvailable: boolean) => {
        if (isAvailable) {
          this.browserTab.openUrl(url);
        } else {
          this.iab.create(url, '_blank', 'location=no');
          // open URL with InAppBrowser instead or SafariViewController
        }
    });
  }
  
}
        
