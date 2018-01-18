import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PaymentBitCoinService } from '../../providers/paymentbitcoin.service';
import { BrowserTab } from '@ionic-native/browser-tab';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { TabsService } from '../../providers/tabs.service';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-bit-pay',
  templateUrl: 'bitpay.html',
  providers: [
    PaymentBitCoinService,
  ]
})
export class BitPayPage {
  
  public bitpayData:any;

  constructor(
    private paymentbitcoin: PaymentBitCoinService,
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    private browserTab: BrowserTab,
    private iab: InAppBrowser,
    private alertCtrl: AlertController,
    public tabsService: TabsService,
  )
  {
  }

  ionViewWillEnter(){
    this.storage.get('cart').then((cart) => {
      this.paymentbitcoin.getBitPay(cart.id).then(
        (success:any) => {
          if( success.status === 200 ) {
            this.bitpayData = JSON.parse(success._body);
            let url = this.bitpayData.url;
            this.browserTab.isAvailable().then((
              isAvailable: boolean) => {
                if (isAvailable) {
                  this.browserTab.openUrl(url);
                  this.storage.remove('cart').then((cart) => {
                    setTimeout(()=>{
                      let alert = this.alertCtrl.create({
                        title: 'Transacción en Proceso',
                        message: 'Nos encontramos validando tu transacción, confirmaremos una vez culminemos el proceso.',
                        buttons: [
                          {
                            text: 'Seguir Comprando',
                            handler: () => {
                              this.tabsService.changeTabInContainerPage(0);
                              this.navCtrl.setRoot(TabsPage);
                            }
                          },
                          {
                            text: 'Ver Mis Bonos',
                            handler: () => {
                              this.tabsService.changeTabInContainerPage(1);
                              this.navCtrl.setRoot(TabsPage);
                            }
                          }
                        ]
                      });
                      alert.present();
                    }, 1500);
                  })
                  .catch(function () {
                    console.log("Error");
                  });
                } else {
                  this.iab.create(url, '_blank', 'location=yes');
                }
            })
            .catch(function () {
              console.log("Error");
            });
          }
        }
      );
    })
    .catch(function () {
      console.log("Error");
    });
  }

}
