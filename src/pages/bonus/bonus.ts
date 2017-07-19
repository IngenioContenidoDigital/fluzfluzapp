import { Component, trigger, style, animate, state, transition } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { BonusService } from '../../providers/bonus.service';
import { SHOW_REFINE_BUTTONS } from '../../providers/config';

@Component({
  selector: 'page-bonus',
  templateUrl: 'bonus.html',
  providers: [BonusService],
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
  public status:any;
  public showRefine:any = SHOW_REFINE_BUTTONS;
  
  constructor(public loadingController: LoadingController, public bonusService: BonusService, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public tabsService: TabsService) {
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
  
  ionViewWillEnter(){
    this.tabsService.hide();
  }

  ionViewWillLeave(){
    this.tabsService.show();
  }
  
  saveStatusBonus(item:any, used:any){
//    console.log(item);
    if(used == 1){
      let alert = this.alertCtrl.create({
        title: 'Actualizar',
        message: 'Por favor ingresa la cantidad usada:',
        inputs: [
          {
            name: 'price_card_used',
            placeholder: '$',
            type: 'number'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Aceptar',
            handler: (data) => {
              this.updateBonus( item.id_product_code, used, data.price_card_used );
            }
          }
        ]
      });
      alert.present();
    }
    else {
      let teminator = this.alertCtrl.create({
        title: 'Actualizar',
        message: 'Seguro quieres marcar como terminado este bono?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Aceptar',
            handler: (data) => {
              this.updateBonus( item.id_product_code, used );
            }
          }
        ]
      });
      teminator.present();
      
    }
  }
  
  updateBonus( card:any, used:any, value:any = 0){
    let loader = this.loadingController.create({
      content: "Enviando..."
    });
    loader.present();
    this.bonusService.updateBonus( card, used, value ).then(
      (data:any) => {
        let rData = JSON.parse(data);
        for(let x of this.bonus){
          if ( x.id_product_code == rData.id_product_code) {
            x.used = rData.used;
            loader.dismiss();
          }
        }
      }
    );    
  }
}
