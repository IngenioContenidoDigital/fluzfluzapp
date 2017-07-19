import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TabsService } from '../../providers/tabs.service';
import { CreditCardService } from '../../providers/credit-card.service';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the Creditcard page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
    selector: 'page-creditcard',
    templateUrl: 'creditcard.html',
    providers: [CreditCardService],
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
export class CreditCardPage {
    creditCardForm: FormGroup;
    
    public enabledPayButton: boolean = false;

    constructor(public loadingController: LoadingController, public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder, public tabsService: TabsService, private CreditCardService: CreditCardService, public storage: Storage, private alertCtrl: AlertController) {
        this.creditCardForm = formBuilder.group({
            'namecard': [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]{5,100}$/i)])],
            'numbercard': [null, Validators.compose([Validators.required, Validators.pattern(/^[0-9]{14,16}$/i)])],
            'datecard': [null, Validators.compose([Validators.required, Validators.pattern(/^[0-9]{2}\/[0-9]{4}$/i)])],
            'codecard': [null, Validators.compose([Validators.required, Validators.pattern(/^[0-9]{3,4}$/i)])]
        });
    }
    
    ionViewWillEnter(){
        this.tabsService.hide();
    }

    ionViewWillLeave(){
        this.tabsService.show();
    }

    validateInputCreditCard(event:any) {
        if (this.creditCardForm.controls['namecard'].valid && this.creditCardForm.controls['numbercard'].valid && this.creditCardForm.controls['datecard'].valid && this.creditCardForm.controls['codecard'].valid) {
            this.enabledPayButton = true;
        } else {
            this.enabledPayButton = false;
        }
    }
    
    pay(dataForm:any):void {
        this.storage.get('userData').then((userData) => {
            this.storage.get('cart').then((cart) => {
                let loader = this.loadingController.create({
                    content: "Pagando..."
                });
                loader.present();
                this.enabledPayButton = false;
                this.CreditCardService.sendPayment(dataForm, userData, cart).subscribe(
                    success => {
                        if(success.status === 200) {
                            loader.dismiss();
                            let response = JSON.parse(success._body);
                            if ( response.success ) {
                                this.storage.remove('cart').then((cart) => {
                                    let title = 'Transacción Exitosa';
                                    let message = response.message;

                                    if ( response.order.order_state == "Pending" ) {
                                        title = 'Transacción en Proceso';
                                        message = 'Nos encontramos validando tu transacción, confirmaremos una vez culminemos el proceso.';
                                    }

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
