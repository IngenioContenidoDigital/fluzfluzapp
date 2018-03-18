import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TabsService } from '../../providers/tabs.service';
import { CreditCardService } from '../../providers/credit-card.service';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';
import { LoadingController } from 'ionic-angular';
import { AnalyticsService } from '../../providers/analytics.service';

@Component({
  selector: 'page-creditcard',
  templateUrl: 'creditcard.html',
  providers: [
    CreditCardService,
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
export class CreditCardPage {
  creditCardForm: FormGroup;

  public enabledPayButton: boolean = false;
  public yearMin:any = new Date().getFullYear();
  public yearMax:any = new Date().getFullYear() + 15;
  public cardSaved:boolean = true;
  public iconview:any = "eye";
  public inputcardtype:any = "password";

  constructor(
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public tabsService: TabsService,
    private CreditCardService: CreditCardService,
    public storage: Storage,
    private alertCtrl: AlertController,
    public analytics: AnalyticsService
  ) {

    let creditCardSaved = navParams.get("creditCardSaved");
    if ( !creditCardSaved ) {
      creditCardSaved = {
        nameOwner : null,
        num_creditCard : null,
        date_expiration : null,
      };
      this.cardSaved = false;
      this.inputcardtype = "number";
      this.iconview = "eye-off";
    }

    this.creditCardForm = formBuilder.group({
      'namecard': [creditCardSaved.nameOwner, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]{5,100}$/i)])],
      'checkautorizationcard': [null, Validators.compose([])],
      'numbercard': [creditCardSaved.num_creditCard, Validators.compose([Validators.required, Validators.pattern(/^[0-9]{14,16}$/i)])],
      'datecard': [creditCardSaved.date_expiration, Validators.compose([Validators.required])],
      'codecard': [null, Validators.compose([Validators.required, Validators.pattern(/^[0-9]{3,4}$/i)])]
    });
  }
    
  ionViewWillEnter(){
    this.analytics.trackView('CreditCartPage');
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
        this.CreditCardService.sendPayment(dataForm, userData, cart).then(
          (response:any) => {
            loader.dismiss();
            console.log('success');
            console.log(response);
            if ( response.success ) {
              this.storage.remove('cart').then((cart) => {
                let title = 'Transacción Exitosa';
                let message = response.message;

                if ( response.order.order_state == "Pending" ) {
                  title = 'Transacción en Proceso';
                  message = 'Nos encontramos validando tu transacción, confirmaremos una vez culminemos el proceso.';
                }

                this.analytics.trackView('ConfirmPayPage');
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
              })
              .catch(function () {
                console.log("Error");
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
          },
          error => { 
            loader.dismiss();
            this.navCtrl.pop();
            console.log(error)
          }
        );
      })
      .catch(function () {
        console.log("Error");
      });
    })
    .catch(function () {
      console.log("Error");
    });
  }
    
  viewCard() {
    if ( this.inputcardtype == "number" ) {
      this.inputcardtype = "password";
      this.iconview = "eye";
    } else {
      this.inputcardtype = "number";
      this.iconview = "eye-off";
    }
  }
}
