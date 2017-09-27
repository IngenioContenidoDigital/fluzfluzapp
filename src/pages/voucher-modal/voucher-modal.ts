import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { AnalyticsService } from '../../providers/analytics.service';
import { VaultService } from '../../providers/vault.service';
import { FLUZ_VALUE } from '../../providers/config';

@Component({
  selector: 'page-voucher-modal',
  templateUrl: 'voucher-modal.html',
  providers: [
    VaultService,
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
export class VoucherModalPage {
  public order:any;
  public products:any;
  public displayProducts:boolean = false;
  constructor(
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public vault: VaultService,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public tabsService: TabsService,
    public analytics: AnalyticsService
  ){
    this.order = navParams.get('order');
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('VoucherModalPage');
    this.updateOrderDetail();
  }
  
  closeModal() {
    this.viewCtrl.dismiss();
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  toggleProducts(){
    this.displayProducts = this.displayProducts ? false : true;
  }
  
  updateOrderDetail(){
    let loader = this.loadingController.create({
      content: "Cargando..."
    });
    loader.present();
    this.order.total_discounts_fluz = (this.order.total_discounts / FLUZ_VALUE) *100;
    this.vault.getOrderDetail(this.order.id_order).then(
      (data:any) => {
        loader.dismiss();
        this.products = data.result;
      }
    );
  }
  
}