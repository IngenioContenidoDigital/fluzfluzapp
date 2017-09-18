import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-network-tree',
  templateUrl: 'network-tree.html',
})
export class NetworkTreePage {
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillEnter() {
    console.log("entre a mostrar el arbol");
  }
  
  
  
}
