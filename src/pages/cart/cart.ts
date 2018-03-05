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
  public showPhones:boolean = false;
  public goToCheck:boolean = false;
  
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
     this.cartService.updateCart( this.cart, userData.id ).then(
        (response:any) => {
          if(loader!=null)loader.dismiss();
          if(response.success === true) {
            this.storage.set('cart', response);
            setTimeout(()=>{ this.updateDataView() }, 100);
          }
          if(response.error === 1) {
            this.storage.set('cart', 'null'); 
           setTimeout(()=>{ this.updateDataView() }, 100);
          }
        },
        error =>{
          console.log(error);
        }
      );
    })
    .catch(function () {
      console.log("Error");
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
    })
    .catch(function () {
      loader.dismiss();
      this.toast('Ha ocurrido un error.');
      this.navCtrl.pop();
      console.log("Error");
    });
  }
  
  goTo(value) {
    switch (value){
      case "checkoutPage": {
        let validatePhonesRecharged = this.validatePhonesRecharged();
        if ( validatePhonesRecharged && this.goToCheck) {
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
      return true
    } else {
      this.showAlert("Faltan datos","Por favor indica los números de teléfono que deseas recargar.");
      return false;
    }
  }
    
  setPhonesRecharged() {
    this.storage.get('userData').then((userData:any) => {
      this.cartService.setPhonesRecharged( this.cart.id, this.phonesRecharged, userData.id).then(
        (response:any) => {
          if(response.success === true) {
            if(response.error === 0) {
              this.goToCheck = true;
              return true;
            }
            else if(response.error === 1){
              this.goToCheck = false;
              this.showAlert("Ha ocurrido un error:","Los datos enviados no son correctos, por favor intenta nuevamente.");
            }
            else if(response.error === 2){
              this.goToCheck = false;
              this.showAlert("Ha ocurrido un error:","Hace falta asignar números de teléfono a algunos productos, por favor intenta nuevamente.");
            }
            else if(response.error === 3){
              this.goToCheck = false;
              this.showAlert("Ha ocurrido un error:","No se ha completado la asignacion de números de teléfono a los productos, por favor intenta nuevamente.");
              return false;
            }
            else {
              this.goToCheck = false;
              this.showAlert("Ha ocurrido un error:","Ocurrió un error inesperado, por favor intenta nuevamente.");
              return false;
            }
          }
          else{
            this.goToCheck = false;
            this.showAlert("Ha ocurrido un error:","Ocurrió un error mientras se agregaba el número de telefono a el producto, por favor intenta nuevamente.");
            return false;
          }
        },
        error => {
          this.goToCheck = false;
          this.showAlert("Ha ocurrido un error:","Ocurrió un error el la respuesta del servidor.");
          console.log(error);
          return false;
        }
      );
    })
    .catch(function () {
      this.goToCheck = false;
      this.showAlert("Ha ocurrido un error:","Ocurrió un error el la lectura de los datos locales.");
      return false;
    });
  }
  
  updateShowTerms(item){
    this.showTerms = this.showTerms != item.id_product ? item.id_product : false;
  }
  
  getPhonesCustomer(){
    this.storage.get('userData').then((userData) => {
      this.personalInformationService.getPhonesCustomer(userData.id).then(
        (response:any) => {
          if(response.success){
            if(response.error == 0){
              this.showPhones = true;
              this.phones = response.result;
            }
            else {
              this.showPhones = false;
            }
          }
        },
        error => {
          this.showAlert("Ha ocurrido un error:","Ocurrió un error al intentar obtener los números de teléfono, por favor intenta nuevamente.");
          console.log(error);
        }
      );
    })
    .catch(function () {
      this.showAlert("Ha ocurrido un error:","Ocurrió un error al intentar obtener los números de teléfono, por favor intenta nuevamente.");
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
                this.personalInformationService.addPhone(userData.id,confirm.phone).then(
                  (response:any) => {
                    if(response.success === true && response.error !== 2 ) {
                      if(response.error == 0){
                        this.getPhonesCustomer();
                        this.phonesRecharged[id_product] = confirm.phone;
                      }
                      else if(response.error == 1){
                        this.showAlert("Error:", "Ya tienes esté número agregado.");
                      }
                    }
                    else {
                      this.showAlert("Ha ocurrido un error:", "No se ha agregado el número correctamente, por favor intenta nuevamente.");
                    }
                  },
                  error => {
                    this.showAlert("Ha ocurrido un error:", "Error al obtener la respuesta del servidor, por favor intenta nuevamente.");
                  }
                );
              })
              .catch(function () {
                this.showAlert("Ha ocurrido un error:", "Error en el servidor, por favor intenta nuevamente.");
                console.log("Error");
              });
            } else {
              this.showAlert("Teléfono Incorrecto", "Por favor indica un número de teléfono valido.");
            }
          }
        }
      ]
    });
    alert.present();
  }
  
  showAlert(title:string, msg:string){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }
  
//  showToast(msg:string, duration:number){
//    let toast = this.toastCtrl.create({
//        message:  msg,
//        duration: duration*1000,
//        position: 'middle',
//        cssClass: "toast"
//    });
//    toast.present();
//  }
  
  ionViewWillEnter(){
    this.analytics.trackView('CartPage');
    this.updateDataView();
    this.tabsService.hide();
    this.getPhonesCustomer();
    this.tabsService.hide();
    this.updateDataView();
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }
}
