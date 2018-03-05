import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { CountryService } from '../../providers/country.service';
import { AnalyticsService } from '../../providers/analytics.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SupportService } from '../../providers/support.service';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-support-modal',
  templateUrl: 'support-modal.html',
  providers: [
    SupportService,
    CountryService,
    AnalyticsService
  ]
})
export class SupportModalPage {
  
  supportForm: FormGroup;
  public enabledSendButton = false;
  
  constructor(
    public loadingController: LoadingController,
    public storage: Storage,
    private alertCtrl: AlertController,
    private countryService: CountryService,
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public tabsService: TabsService,
    public formBuilder: FormBuilder,
    public analytics: AnalyticsService,
    public supportService: SupportService
  ) {
    this.supportForm = formBuilder.group({
      'issue' : [null, Validators.compose([Validators.required])],
      'problem' : [null, Validators.compose([Validators.required])]
    });
    
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('Support-ModalPage');
    this.tabsService.hide();
  }
  
  ionViewDidLoad() {
    this.tabsService.show();
  }
  
  dismiss( item:any, cod:any ) {
  }
  
  validateInput(event:any) {
    this.enabledSendButton = (
      this.supportForm.controls['issue'].valid &&
      this.supportForm.controls['problem'].valid
    ) ? true : false;
  }
  
  sendProblem(valor){
    let loader = this.loadingController.create({
      content: "Enviando..."
    });
    loader.present();
    this.storage.get('userData').then((val) => {
      let name = val.firstname+' '+val.lastname;
      this.supportService.sendProblem(val.id, name, val.email, valor).then(
        (response:any) => {
          loader.dismiss();
          if(response.success === true) {
            this.enabledSendButton = false;
            let alert = this.alertCtrl.create({
              title: 'Enviado',
              subTitle: 'Se ha enviado tu problema, nos contactaremos contigo en breve.',
              buttons: [{
                text: 'Ok',
                handler: () => {
                  setTimeout(()=>{ this.navCtrl.pop() }, 500);
                }
              }]
            });
            alert.present();
          } else {
            this.enabledSendButton = true;
            let alert = this.alertCtrl.create({
              title: 'No se ha enviado tu problema',
              subTitle: response.error['0'],
              buttons: ['OK']
            });
            alert.present();
          }
        },
        error => {
          loader.dismiss();
          this.enabledSendButton = true;
          let alert = this.alertCtrl.create({
            title: 'Error:',
            subTitle: 'No se ha podido enviar tu problema, por favor intenta nuevamente.',
            buttons: ['OK']
          });
          alert.present();
        }
      );
    });
  }
}