import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { MyAccountService } from '../../providers/myAccount.service'
import { Storage } from '@ionic/storage';
import { TabsService } from '../../providers/tabs.service';
import { AnalyticsService } from '../../providers/analytics.service';

@Component({
  selector: 'page-reactive-account',
  templateUrl: 'reactive-account.html',
  providers: [MyAccountService]
})
export class ReactiveAccountPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public loadingController: LoadingController,
    private alertCtrl: AlertController,
    public analytics: AnalyticsService,
    public tabsService: TabsService,
    public myAccount: MyAccountService
    ) {
  }

  ionViewWillEnter(){
    this.analytics.trackView('LoginPage');
    this.tabsService.hide();
  }
  reactiveAccount() {
    let loader = this.loadingController.create({
      content: "Cargando..."
    });
    loader.present();
    this.storage.get('userData').then((val) => {
      this.myAccount.reactivateAccount(val.id).then(
        (data:any)=>{
          console.log(data);
          loader.dismiss();
          if( data.result == true ){
            this.showAlert('Listo!','Tu cuenta ha sido Reactivada.');
            this.navCtrl.pop();
          }
          else{
            this.showAlert('Error:','Ha ocurrido un error al Reactivar tu cuenta, por favor intenta de nuevo más tarde.');
          }
        },
        () => {
          loader.dismiss(); 
          this.showAlert('Error:','Ha ocurrido un error al Reactivar tu cuenta, por favor intenta de nuevo más tarde.');
          this.navCtrl.pop();
        }
      );
    });
  }
  
  showAlert(title:string, subtitle:string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }
}
