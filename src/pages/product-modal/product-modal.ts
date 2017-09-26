import { Component, EventEmitter, Output } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { ProductChildPage } from '../product-child/product-child';
import { SearchService } from '../../providers/search.service';
import { ProductFatherPage } from '../product-father/product-father';
import { SHOW_SAVINGS } from '../../providers/config';
import { Storage } from '@ionic/storage';
import { CartService } from '../../providers/cart.service';
import { AnalyticsService } from '../../providers/analytics.service';

@Component({
  selector: 'page-product-modal',
  templateUrl: 'product-modal.html',
  providers: [
    SearchService,
    ProductChildPage,
    CartService,
    AnalyticsService
  ],
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
  
  @Output('updateCountCart')
  public updateCountCart: EventEmitter<number> = new EventEmitter<number>();
  
  constructor(
    public storage: Storage,
    public navCtrl: NavController,
    public cartService: CartService,
    public navParams: NavParams,
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
          this.showChild = true;
          this.productFather = data.result;
          this.searchService.search( this.productFather[0].id_parent, '3' ).then((data:any) => {
            loader.dismiss();
            this.productChild = data;
            this.intructions = this.productChild.result[0].instructions;
            this.terms = this.productChild.result[0].terms;
          });
        }
        else {
          loader.dismiss();
          this.productFather = data;
        }
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
      manufacturer: item
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
    this.storage.get('cart').then((val) => {
      this.idCart = ( val != undefined && val != null && val != '' ) ? val.id : 0;
      this.cartService.addToCart( this.idCart, idProduct).subscribe(
        success => {
          if(success.status === 200) {
            this.storage.set('cart', JSON.parse(success._body));
            this.updateCountCartEmit();
          }
        },
        error =>{
          console.log(error)
        }
      ); 
    });
  }
  
  updateCountCartEmit(){
    setTimeout(() => {
      this.storage.get('cart').then((val) => {
        this.updateCountCart.emit( val.quantity );
      });
    },500);
  }
}
