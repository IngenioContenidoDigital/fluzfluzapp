import { Component, EventEmitter, Output } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { ProductChildPage } from '../product-child/product-child';
import { SearchService } from '../../providers/search.service';
import { ProductFatherPage } from '../product-father/product-father';
import { SHOW_SAVINGS } from '../../providers/config';

@Component({
  selector: 'page-product-modal',
  templateUrl: 'product-modal.html',
  providers: [SearchService,ProductChildPage],
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
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public searchService: SearchService, public loadingController: LoadingController, public viewCtrl: ViewController ) {
    this.productMap = navParams.get('productMap');
    this.manufacturer = this.productMap.result[0];
  }

  ionViewWillEnter(){
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
}
