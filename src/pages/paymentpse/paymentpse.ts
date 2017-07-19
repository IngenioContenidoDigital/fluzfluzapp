import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { TabsService } from '../../providers/tabs.service';
import { PaymentPseService } from '../../providers/paymentpse.service';
import { LoadingController } from 'ionic-angular';
import { BancoService } from '../../providers/banco.service';
import { BrowserTab } from '@ionic-native/browser-tab';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the Paymentpse page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-paymentpse',
  templateUrl: 'paymentpse.html',
  providers: [BancoService,PaymentPseService],
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
export class PaymentPsePage {
    public bancos:any = [];
    public bankname:string = '';
    public enabledPayButton: boolean = false;

    pseForm: FormGroup;
  
    constructor(private iab: InAppBrowser, private browserTab: BrowserTab, public loadingController: LoadingController, formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams, public tabsService: TabsService, private backService: BancoService, private PaymentPseService: PaymentPseService, public storage: Storage, private alertCtrl: AlertController) {
        
        this.pseForm = formBuilder.group({
                'bank': [null, Validators.compose([Validators.required])],
                'typecustomer': ["N", Validators.compose([Validators.required])],
                'typedocument': ["CC", Validators.compose([Validators.required])],
                'numberdocument': [null, Validators.compose([Validators.required])],
            });
        
    }
  
    ionViewWillEnter(){
        this.tabsService.hide();
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
        this.backService.getBanks().subscribe(
            success => {
                if(success.status === 200) {
                    let response = JSON.parse(success._body);
                    this.bancos = response;
                    loader.dismiss();
                }
            },
            error => {
                this.tabsService.changeTabInContainerPage(0);
                this.navCtrl.setRoot(TabsPage);
                console.log(error);
            }
        );
    }
    
    validateInputPse(event:any) {
        if (this.pseForm.controls['bank'].valid && this.pseForm.controls['typecustomer'].valid && this.pseForm.controls['typedocument'].valid && this.pseForm.controls['numberdocument'].valid) {
            this.enabledPayButton = true;
        } else {
            this.enabledPayButton = false;
        }
        for(let b of this.bancos){
            if( b.value == this.pseForm.value['bank'] ){
                this.bankname = b.name;
            }
        }
    }
    
    openUrl(url:any){
        this.browserTab.isAvailable().then((isAvailable: boolean) => {
            if (isAvailable) {
                this.browserTab.openUrl(url);
            } else {
                this.iab.create(url, '_blank', 'location=yes');
            }
        });
    }
    
    pay(dataForm:any):void {
        this.storage.get('userData').then((userData) => {
            this.storage.get('cart').then((cart) => {
                let loader = this.loadingController.create({
                    content: "Pagando..."
                });
                loader.present();
                this.enabledPayButton = false;
                this.PaymentPseService.sendPayment(dataForm, this.bankname, userData, cart).subscribe(
                    success => {
                        if(success.status === 200) {
                            loader.dismiss();
                            let response = JSON.parse(success._body);
                            console.log(response);
                            if ( response.success ) {
                                this.storage.remove('cart').then((cart) => {
                                    let title = 'Transacción Exitosa';
                                    let message = response.message;

                                    if ( response.order.order_state == "Pending" ) {
                                        title = 'Transacción en Proceso';
                                        message = 'Nos encontramos validando tu transacción, confirmaremos una vez culminemos el proceso.';
                                    }

                                    this.openUrl(response.pay_info.url_pay_pse);

                                    let alert = this.alertCtrl.create({
                                        title: title,
                                        message: message,
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
                                });
                            } else {
                                this.enabledPayButton = true;
                                let alert = this.alertCtrl.create({
                                    title: 'Error Generando Pago',
                                    subTitle: response.message,
                                    buttons: ['OK']
                                });
                                alert.present();
                            }
                        }
                    },
                    error => { 
                        console.log(error)
                    }
                );
            });
        });
    }
}
