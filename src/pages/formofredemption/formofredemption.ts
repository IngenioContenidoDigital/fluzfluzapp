import { Component, trigger, style, animate, state, transition  } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TabsService } from '../../providers/tabs.service';
import { Banco } from '../../models/banco';
import { Storage } from '@ionic/storage';
import { BancoService } from '../../providers/banco.service';
import { Redemption } from '../../providers/redemption.service';
import { RedemptionConfirmPage } from '../redemption-confirm/redemption-confirm';
import { LoadingController } from 'ionic-angular';
import { AnalyticsService } from '../../providers/analytics.service';

@Component({
  selector: 'page-formofredemption',
  templateUrl: 'formofredemption.html',
  providers: [
    BancoService,
    Redemption,
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
export class FormOfRedemptionPage {

  public disponibleFluz:any = {};
  public redemptionValue:any = {};
  public redemptionData:any = {};
  public dataUserRedemption:any = {};
  public enableContinue:any = false;
  public bancos:Banco[];
  
  dataRedemption: FormGroup;
  
  constructor(
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public tabsService: TabsService,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private backService: BancoService,
    private redemption: Redemption,
    public storage: Storage,
    public analytics: AnalyticsService
  ) {
    this.disponibleFluz = navParams.get("disponibleFluz");
    this.redemptionValue = navParams.get("redemptionValue");
    this.dataRedemption = formBuilder.group({
        firts_name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        last_name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        card: ['', Validators.compose([Validators.maxLength(12), Validators.pattern('^[1-9][0-9]*$')])],
        cardVirtual: ['', Validators.compose([Validators.maxLength(12), Validators.pattern('^[a-zA-Z0-9]*$')])],
        n_identification: ['', Validators.compose([Validators.maxLength(10), Validators.pattern('^[1-9][0-9]*$'), Validators.required ])]
    });
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('FormOfRedemptionPage');
    this.tabsService.hide();
    this.dataUserRedemption.type_vitual = this.dataUserRedemption.typeRedemption = this.dataUserRedemption.identification = this.dataUserRedemption.banco = this.dataUserRedemption.type_acount = 0;
    this.getDataBank();
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }
  
  getDataBank(){
    let loader = this.loadingController.create({
      content: "Cargando Lista de Bancos"
    });
    loader.present();
    this.backService.getBanks().then(
      (response:any) => {
        loader.dismiss();
        if(response.success === true) {
          if(response.error){
            let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: 'La plataforma de pagos no responde. Intente nuevamente más tarde.',
              buttons: [{
                text: 'Ok',
                handler: () => {
                  let navTransition = alert.dismiss();
                  navTransition.then(() => {
                    this.navCtrl.pop();
                  })
                  .catch(function () {
                    console.log("Error");
                  });
                  return false;
                }
              }]
            });
            alert.present();
          }
          else {
            this.bancos = response.banks;
          }
        }
        else{
          loader.dismissAll();
          this.showAlert("Error", "No hemos podido cargar la lista de bancos, por favor revisa tu conexión e intenta de nuevo.");
          this.navCtrl.pop();
        }
      },
      error => {
        loader.dismissAll();
        this.showAlert("Error", "No hemos podido cargar la lista de bancos, por favor revisa tu conexión e intenta de nuevo.");
        this.navCtrl.pop();
      }
    );
  }
  
  setIdentification(value:any){
    this.dataUserRedemption.identification = value;
    this.updateEnableContinue();
  }
  
  setBanco(value:any){
    this.dataUserRedemption.banco = value;
    this.updateEnableContinue();
  }
  
  setTypeRedemption(value:any){
    this.dataUserRedemption.typeRedemption = value;
    this.updateEnableContinue();
  }
  
  setTypeAccount(value:any){
    this.dataUserRedemption.type_acount = value;
    this.updateEnableContinue();
  }
  
  setTypeVirtual(value:any){
    this.dataUserRedemption.type_vitual = value;
    this.updateEnableContinue();
  }
  
  validateString( event:any ) {
    this.updateEnableContinue();
  }
  
  updateEnableContinue(){
    if ( ( this.dataRedemption.controls['firts_name'].valid && this.dataRedemption.controls['last_name'].valid) && this.dataUserRedemption.identification != 0 ){
      if ( this.dataUserRedemption.typeRedemption == 1 ){
        this.dataRedemption.get('cardVirtual').setValue(0);
        this.dataUserRedemption.type_vitual = 0;
        if (this.dataRedemption.controls['card'].valid && this.dataRedemption.get('card').value != 0 && ( this.dataUserRedemption.banco != 0 && this.dataUserRedemption.type_acount != 0 ) ){
          this.enableContinue = true;
        }
        else{
          this.enableContinue = false;
        }
      }
      else if( this.dataUserRedemption.typeRedemption == 2 ){
        this.dataRedemption.get('card').setValue(0);
        this.dataUserRedemption.banco = 0;
        this.dataUserRedemption.type_acount = 0;
        if( this.dataRedemption.controls['cardVirtual'].valid && this.dataRedemption.get('cardVirtual').value != 0 && ( this.dataUserRedemption.type_vitual != 0 ) ){
          this.enableContinue = true;
        }
        else{
          this.enableContinue = false;
        }
      }
      else{
        this.enableContinue = false;
      }
    }
    else{
      this.enableContinue = false;
    }
  }
  
  sendToRedemption( redemptionData:any ){
    let loader = this.loadingController.create({
      content: "Enviando..."
    });
    loader.present();
    this.redemptionData = redemptionData.value;
    Object.assign(this.redemptionData, this.dataUserRedemption);
    Object.assign(this.redemptionData, this.redemptionValue);
    this.storage.get('userData').then((val) => {
      this.redemption.setRedemption( val.id, this.redemptionData ).then(
        (data:any) => {
          loader.dismiss();
          if(data.result == "error"){
            let alert = this.alertCtrl.create({
              title: 'Error Generando Transferencia',
              subTitle: 'Ha ocurrido un error en el proceso de transferencia de fluz.',
              buttons: ['OK']
            });
            alert.present();
          }
          else {
            this.goTo("Continue");
          }
        }
      )
      .catch(function () {
        console.log("Error");
      });
    })
    .catch(function () {
      console.log("Error");
    });
  }
  
  goTo(value:any) {
    switch (value){
      case "Continue": {
        this.navCtrl.push(RedemptionConfirmPage, {
          disponibleFluz: this.disponibleFluz
        });
        break;
      }
      default: {
        this.navCtrl.pop();        
        break;
      }
    }
  }
  
  showAlert(title:string, subTitle:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }
}
