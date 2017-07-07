import { Component, trigger, style, animate, state, transition  } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TabsService } from '../../providers/tabs.service';
import { Banco } from '../../models/banco';
import { BancoService } from '../../providers/banco.service';
import { Redemption } from '../../providers/redemption.service';
import { RedemptionConfirmPage } from '../redemption-confirm/redemption-confirm';
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the FormofredemptionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-formofredemption',
  templateUrl: 'formofredemption.html',
  providers: [BancoService, Redemption],
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
  
  constructor(public loadingController: LoadingController, public navCtrl: NavController, public navParams: NavParams, public tabsService: TabsService, formBuilder: FormBuilder, private backService: BancoService, private redemption: Redemption) {
    this.disponibleFluz = navParams.get("disponibleFluz");
    this.redemptionValue = navParams.get("redemptionValue");
    this.dataRedemption = formBuilder.group({
        firts_name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        last_name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        card: ['', Validators.compose([Validators.maxLength(12), Validators.pattern('^[1-9][0-9]*$'), Validators.required ])],
        n_identification: ['', Validators.compose([Validators.maxLength(10), Validators.pattern('^[1-9][0-9]*$'), Validators.required ])]
    });
  }
  
  ionViewWillEnter(){
    this.tabsService.hide();
    this.dataUserRedemption.identification = this.dataUserRedemption.banco = this.dataUserRedemption.type_acount = 0;
    this.getDataBank();
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }
  
  getDataBank(){
    this.backService.getBanks().then(bancos => this.bancos = bancos);
  }
  
  setIdentification(value:any){
    this.dataUserRedemption.identification = value;
    this.updateEnableContinue();
  }
  
  setBanco(value:any){
    this.dataUserRedemption.banco = value;
    this.updateEnableContinue();
  }
  
  setTypeAccount(value:any){
    this.dataUserRedemption.type_acount = value;
    this.updateEnableContinue();
  }
  
  validateString( event:any ) {
    this.updateEnableContinue();
  }
  
  updateEnableContinue(){
    if ( 
      this.dataUserRedemption.identification != 0 &&
      this.dataUserRedemption.banco != 0 &&
      this.dataUserRedemption.type_acount != 0 &&
      (this.dataRedemption.controls['firts_name'].valid && 
       this.dataRedemption.controls['last_name'].valid && 
       this.dataRedemption.controls['card'].valid && 
       this.dataRedemption.controls['n_identification'].valid) 
     ){
      this.enableContinue = true;
    }
    else {
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
    this.redemption.setRedemption( this.redemptionData ).then(
      (data:any) => {
        loader.dismiss();
        this.goTo("Continue");
      }
    );
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
}
