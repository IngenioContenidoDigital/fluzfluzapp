import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CartService } from '../../providers/cart.service';
import { CheckoutPage } from '../checkout/checkout';
import { TabsService } from '../../providers/tabs.service';
import { TabsPage } from '../tabs/tabs';
//import { HomePage } from '../home/home';
import { SHOW_SAVINGS } from '../../providers/config';
import { PersonalInformationService } from '../../providers/personalinformation.service';
import { AnalyticsService } from '../../providers/analytics.service';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
  providers: [
    CartService,
    PersonalInformationService,
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
export class CartPage {

  public products:Array<Object>;
  public cart:any = {};
  public discounts:any = {};
  public displayOptions:any = 0;
  public index:any = -1;
  public textEditButton:string = "Editar";
  public showTerms = false;
  public showSavings = SHOW_SAVINGS;
  public phones:any = [];
  public phonesRecharged:any = {};
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public cartService: CartService,
    public loadingController: LoadingController,
    public tabsService: TabsService,
    public viewCtrl: ViewController,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public personalInformationService: PersonalInformationService,
    public analytics: AnalyticsService
  ) {
  }
  
  edit(){
    if( this.displayOptions == "0" ) {
      this.textEditButton = "Actualizar";
      this.displayOptions = "135px";
      this.index = 0;
    }
    else {
      this.textEditButton = "Editar";
      this.displayOptions = "0";
      this.index = -1;
      this.updateCart();
    }
  }
  
  toast(msg){
    let toast = this.toastCtrl.create({
          message:  msg,
          duration: 1000,
          position: 'middle',
          cssClass: "toast"
        });
    toast.present();
  }
 
  updateQuantity(value, id_product){
    if ( value == 0 ){
      for (var i = 0; i < this.products.length; i++) {
        if ( this.products[i]['id_product'] == id_product && this.products[i]['quantity'] > 0 ){
          this.products[i]['quantity']--;
        }
      }
    }
    else if ( value == 1){
      for (var i = 0; i < this.products.length; i++) {
        if ( this.products[i]['id_product'] == id_product ){
          this.products[i]['quantity']++;
        }
      }
    }
  }
  
  removeProduct(id_product) {
    let loader = this.loadingController.create({
      content: "Eliminando..."
    });
    loader.present();
    delete this.phonesRecharged[id_product];
    for (var i = 0; i < this.products.length; i++) {
      if ( this.products[i]['id_product'] == id_product ){
        this.products[i]['quantity'] = 0;
      }
    }
    this.updateCart(loader);
  }
  
  updateCart(loader = null){
    this.cart.products = this.products;
    this.storage.get('userData').then((userData) => {
     this.cartService.updateCart( this.cart, userData.id ).subscribe(
        success => {
          if(loader!=null)loader.dismiss();
          if(success.status === 200) {
            this.storage.set('cart', JSON.parse(success._body));
            setTimeout(()=>{ this.updateDataView() }, 100);
          }
          if(success.status === 204) {
            this.storage.set('cart', 'null'); 
           setTimeout(()=>{ this.updateDataView() }, 100);
          }
        },
        error =>{
          console.log(error);
        }
      );
    });
  }
 
  updateDataView () {
    let loader = this.loadingController.create({
      content: "Cargando carrito..."
    });
    loader.present();
    this.storage.get('cart').then((val) => {
      loader.dismiss();
      this.cart = ( val != undefined && val != null && val != '' ) ? val : {};
      this.products = ( val != undefined && val != null && val != '' ) ? val.products : [];
      this.discounts = ( val != undefined && val != null && val != '' ) ? val.discounts : [];
    }),
    () => {
      loader.dismiss();
      this.toast('Ha ocurrido un error.');
      this.navCtrl.pop();
    };
  }
  
  goTo(value) {
    switch (value){
      case "checkoutPage": {
        let validatePhonesRecharged = this.validatePhonesRecharged();
        if ( !validatePhonesRecharged ) {
          let alert = this.alertCtrl.create({
            title: "Faltan datos",
            subTitle: "Por favor indica los números de teléfono que deseas recargar.",
            buttons: ['OK']
          });
          alert.present();
        } else {
          this.navCtrl.push( CheckoutPage,{
            cart: this.cart
          });
        }
        break;
      }
      default: {
        this.navCtrl.popToRoot();
        break;
      }
    }
  }
    
  validatePhonesRecharged(){
    let productsTelco = 0;
    let phonesRecharged = Object.keys(this.phonesRecharged).length;
        
    for (var i = 0; i < this.products.length; i++) {
      if ( this.products[i]['reference'].indexOf('MOV-') != -1 ){
        productsTelco++;
      }
    }
        
    if ( productsTelco == phonesRecharged || productsTelco == 0 ) {
      this.setPhonesRecharged();
      return true;
    } else {
      return false;
    }
  }
    
  setPhonesRecharged() {
    this.storage.get('userData').then((userData) => {
      this.cartService.setPhonesRecharged( this.cart.id, this.phonesRecharged, userData.id).subscribe(
        success => {
          if(success.status === 200) {
            return true;
          }
        },
        error => {
          console.log(error);
        }
      );
    });
  }
  
  updateShowTerms(item){
    this.showTerms = this.showTerms != item.id_product ? item.id_product : false;
  }
  
  getPhonesCustomer(){
    this.storage.get('userData').then((userData) => {
      this.personalInformationService.getPhonesCustomer(userData.id).subscribe(
        success => {
          if(success.status === 200) {
            let response = JSON.parse(success._body);
            this.phones = response;
          }
        },
        error => {
          this.tabsService.changeTabInContainerPage(0);
          this.navCtrl.setRoot(TabsPage);
          console.log(error);
        }
      );
    });
  }
    
    addNewPhone(id_product){
        let alert = this.alertCtrl.create({
            title: 'Número a recargar',
            subTitle: "Ingresa tu nuevo número teléfonico",
            inputs: [{
                name: 'phone',
                placeholder: 'Teléfono',
                type: 'number',
                min: 10
            }],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: 'Continuar',
                    handler: confirm => {
                        if ( confirm.phone != "" && confirm.phone.length == 10 ) {
                            this.storage.get('userData').then((userData) => {
                                this.personalInformationService.addPhone(userData.id,confirm.phone).subscribe(
                                    success => {
                                        if(success.status === 200) {
                                            this.getPhonesCustomer();
                                            this.phonesRecharged[id_product] = confirm.phone;
                                        }
                                    },
                                    error => {
                                        this.tabsService.changeTabInContainerPage(0);
                                        this.navCtrl.setRoot(TabsPage);
                                        console.log(error);
                                    }
                                );
                            });
                        } else {
                            let alert = this.alertCtrl.create({
                                title: "Teléfono Incorrecto",
                                subTitle: "Por favor indica un número de teléfono valido.",
                                buttons: ['OK']
                            });
                            alert.present();
                        }
                    }
                }
            ]
        });
        alert.present();
    }
  
  ionViewWillEnter(){
    this.analytics.trackView('CartPage');
    this.getPhonesCustomer();
    this.tabsService.hide();
    this.updateDataView();
  }
  
  ionViewWillLeave(){
    this.tabsService.show();
  }
}
