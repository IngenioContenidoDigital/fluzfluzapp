import { Component, trigger, style, animate, state, transition,  EventEmitter, Output, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { ProductChildPage } from '../product-child/product-child';
import { SearchService } from '../../providers/search.service';
import { ProductFatherPage } from '../product-father/product-father';
import { SHOW_SAVINGS } from '../../providers/config';
import { Storage } from '@ionic/storage';
import { CartService } from '../../providers/cart.service';
import { AnalyticsService } from '../../providers/analytics.service';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-product-modal',
  templateUrl: 'product-modal.html',
  providers: [
    SearchService,
    ProductChildPage,
    CartService,
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
export class ProductModalPage {
  public backButtom:any = true;
  
  @Output()
  public showBackButton: EventEmitter<string> = new EventEmitter<string>();
  
  public productMap:any;
  public manufacturer:any = {};
  public productFather:any = {};
  public productChild:any = {};
  public intructions:any = '';
  public terms:any = '';
  public showChild = false;
  public showSavings = SHOW_SAVINGS;
  public idCart:any = 0;
  public infoFooter:any = [];
  
  @Output('updateCountCart')
  public updateCountCart: EventEmitter<number> = new EventEmitter<number>();
  
  @ViewChild('header') header;
  
  constructor(
    public storage: Storage,
    public navCtrl: NavController,
    public cartService: CartService,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public searchService: SearchService,
    public loadingController: LoadingController,
    public viewCtrl: ViewController,
    public analytics: AnalyticsService
  ){
    this.productMap = navParams.get('productMap');
    this.manufacturer = this.productMap.result[0];
  }

  ionViewWillEnter(){
    this.analytics.trackView('ProductModalPage');
    let loader = this.loadingController.create({
      content: "Cargando..."
    });
    loader.present();
    setTimeout(()=>{
      this.searchService.search( this.manufacturer.m_id, '2' ).then((data:any) => {
        if(data.total == 1){
          this.header.showProductChildPageBtn(true);
          this.updateFooter();
          this.showChild = true;
          this.productFather = data.result;
          this.searchService.search( this.productFather[0].id_parent, '3' ).then((data:any) => {
            loader.dismiss();
            this.productChild = data;
            this.intructions = this.productChild.result[0].instructions;
            this.terms = this.productChild.result[0].terms;
          })
          .catch(error =>{
            console.log(error);
          });
        }
        else {
          loader.dismiss();
          this.productFather = data;
        }
      })
      .catch(error =>{
        console.log(error);
      });
    }, 500 );    
  }
  
  // caso 1: Abre los comercios en la misma ubicación        [ search-modal   ]
  // caso 2: Abre el comercio con más de un producto padre.  [ product-father ]
  // caso 3: Abre el comercio con 1 producto padre.          [ product-child  ]
  
  // Necesario para caso 1
  openItem(item:any) {
    this.showBackButton.emit(this.backButtom);
    this.navCtrl.push(ProductFatherPage,{
      manufacturer: item,
      productMap: true
    });
  }
  
  // Necesario para caso 2
  openItemChild(item:any) {
    this.navCtrl.push(ProductChildPage,{
      manufacturer: this.manufacturer,
      productFather: item
    });
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  addToCart(idProduct:any){
    this.storage.get('userData').then((userData) => {
      this.storage.get('cart').then((val) => {
        this.idCart = ( val != undefined && val != null && val != '' ) ? val.id : 0;
        this.cartService.addToCart( this.idCart, idProduct, userData.id ).then(
          (success:any) => {
            if(success.status === 200) {
              this.storage.set('cart', JSON.parse(success._body));
              this.updateCountCartEmit();
            }
          },
          error =>{
            console.log(error)
          }
        ); 
      })
      .catch(error =>{
        console.log(error);
      });
    })
    .catch(error =>{
      console.log(error);
    });
  }
  
  updateCountCartEmit(){
    let loader = this.loadingController.create({
      content: "Actualizando Carrito..."
    });
    loader.present();
    setTimeout(() => {
      this.storage.get('cart').then((val) => {
        this.updateCountCart.emit( val.quantity );
        loader.dismiss();
        this.toast('Agregado al carrito.');
        setTimeout(() => {
          this.updateFooter();
        },200);
      })
      .catch(error =>{
        console.log(error);
      });
    },500);
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
  
  updateFooter(){
    this.storage.get('cart').then((val) => {
      if(val != null && val != "null" && val != "" ){
        this.infoFooter.img = val.products[0].image_manufacturer;
        this.infoFooter.number = val.quantity;
        this.infoFooter.subtotal = val.format_order_total;
      }
      else {
        this.infoFooter.number = 0;
      }
    });
  }
  
  openCart(){
    let loader = this.loadingController.create({
      content: "Cargando Carrito..."
    });
    loader.present();
    this.navCtrl.push( CartPage ).then(()=>{
      setTimeout(() => {
        loader.dismiss();
      },200);
    });
  }
}
