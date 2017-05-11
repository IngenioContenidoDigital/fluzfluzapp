import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ConfirmPage } from '../confirm/confirm';
import { ConfirmatedPage } from '../confirmated/confirmated';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController
  ) {}
  
  public goToLogin() {
    this.navCtrl.push( LoginPage );
  }
  
  public goToConfirm() {
    this.navCtrl.push( ConfirmPage );
  }
    
  public goToConfirmated() {
    this.navCtrl.push( ConfirmatedPage );
  }
    
  
}
