import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Bonus page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-bonus',
  templateUrl: 'bonus.html',
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
export class BonusPage {

  public manufacturer:any;
  public bonus:any = [];
  public bonusT:any;
  public showDetails:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.manufacturer = navParams.get("manufacturer");
    this.bonus = navParams.get("bonus");
    this.bonus.showDetails = true;
    this.bonusT = navParams.get("bonusT");
  }
  
  toggleDetails(data) {
    this.showDetails = ( this.showDetails != data.id_product_code ) ? data.id_product_code : false ; 
  }
  
  toggleDescription(data, option){
    switch (option){
      case "1": {
        data.showDescription = data.showDescription ? false : true ;
        break;
      }
      case "2": {
        data.showDirections = data.showDirections ? false : true ;
        break;
      }
      case "3": {
        data.showTerms = data.showTerms ? false : true ;
        break;
      }
      default: {
        break;
      }
    }
    
  }

}
