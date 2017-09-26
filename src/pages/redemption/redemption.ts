import { Component, trigger, style, animate, state, transition  } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { TabsPage } from '../tabs/tabs';
import { FormOfRedemptionPage } from '../formofredemption/formofredemption';
import { Storage } from '@ionic/storage';
import { MyAccountService } from '../../providers/myAccount.service';
import { AnalyticsService } from '../../providers/analytics.service';
import { REDEMPTION_MIN_VALUE } from '../../providers/config';
import { FLUZ_VALUE } from '../../providers/config';

@Component({
  selector: 'page-redemption',
  templateUrl: 'redemption.html',
  providers: [
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
export class RedemptionPage {
  
  public userData:any = {};
  public valueRedemption:any = {};
  public showFluzRange:any = false;
  public displayRedemption:any = false;
  public disponibleFluz:any = {};
  public payment:any = 1;
  public singleValue:any = 0;
  public minValueRedemption = (REDEMPTION_MIN_VALUE/FLUZ_VALUE);
  
  constructor(
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public tabsService: TabsService,
    public storage: Storage,
    public myAccount: MyAccountService,
    public analytics: AnalyticsService
  ){
    this.disponibleFluz.fluzTotal = 0;
    this.disponibleFluz.totalSavings = 0;
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('RedemptionPage');
    this.getUserData();
    setTimeout(()=>{ this.resetValueRedemption(); }, 500);
  }

  
  goTo(value:any) {
    switch (value){
      case "HomePage": {
        this.tabsService.changeTabInContainerPage(0);
        this.navCtrl.setRoot(TabsPage);
        break;
      }
      case "FromOfRedemptionPage": {
        var redemptionValue = (this.payment == 1) ? this.userData : this.valueRedemption;

        this.navCtrl.push(FormOfRedemptionPage,{
          disponibleFluz: this.disponibleFluz,
          redemptionValue: redemptionValue
        });
        break;
      }
      default: {
        this.tabsService.changeTabInContainerPage(0);
        this.navCtrl.setRoot(TabsPage);
        break;
      }
    }
  }
  
  getUserData() {
    let loader = this.loadingController.create({
      content: "Cargando datos de usuario..."
    });
    loader.present();
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.userData.userName = val.firstname;
        this.myAccount.getDataAccount(val.id).then(
          (data:any) => {
            this.userData = Object.assign(this.userData, JSON.parse(data));
            this.userData.fluzLasted === null ? this.userData.fluzLasted = 0 : this.userData.fluzLasted = this.userData.fluzLasted;
            setTimeout(()=>{ 
              loader.dismiss();
              this.validateMinValue(); 
            }, 500);
          }
        );
      }
    });
  }
  
  resetValueRedemption() {
    this.valueRedemption.fluzTotal = this.userData.fluzTotal;
    this.valueRedemption.totalSavings = this.userData.totalSavings;
    this.updateValuesRedemption();
  }
  
  updateValuesRedemption( value = 0 ) {
    this.disponibleFluz.fluzTotal = ( this.userData.fluzTotal - this.valueRedemption.fluzTotal );
    this.valueRedemption.totalSavings = this.valueRedemption.fluzTotal * 25;
    this.disponibleFluz.totalSavings = ( this.userData.totalSavings - this.valueRedemption.totalSavings );
  }
    
  selectedPayment(value){
    if ( value != this.payment ){ this.toggleFluzRange(); }
    this.payment = value;
    if ( value == 1 ){
      this.resetValueRedemption();
    }
  }
  
  toggleFluzRange(){
    this.showFluzRange = this.showFluzRange ? false : true;
  }
  
  validateMinValue() {
    this.displayRedemption = ( this.userData.totalSavings >= REDEMPTION_MIN_VALUE ) ? true : false;
  }
  
}
