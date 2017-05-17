import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchService } from '../../providers/search.service';

/**
 * Generated class for the ProductChild page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-product-child',
  templateUrl: 'product-child.html',
  providers: [SearchService]
})
export class ProductChildPage {
  public manufacturer:any = {};
  public productFather:any = {};
  public productChild:any = {};
  public intructions:any = '';
  public terms:any = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public searchService: SearchService) {
    this.manufacturer = navParams.get("manufacturer");
    this.productFather = navParams.get("productFather");
    this.searchService.search( this.productFather.id_parent, '3' ).then((data) => {
      this.productChild = data;
      this.intructions = this.productChild.result['0'].instructions;
      this.terms = this.productChild.result['0'].terms;
    });
  }

}
