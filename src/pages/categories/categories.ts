import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CategoryService } from '../../providers/category.service';
import { CategoryPage } from '../category/category';

/**
 * Generated class for the CategoriesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
  providers: [ CategoryService ]
})
export class CategoriesPage {

  public categories:any = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public categoryService: CategoryService) {
    this.categories = navParams.get("categories");
  }
  
  openCategoryById( item:any ){
    this.categoryService.getCategory( 3, item.id_category ).then(
      (data:any) => {
        this.navCtrl.push( CategoryPage, {
          category: item,
          products: data.products
        });
      }  
    );
  }
}
