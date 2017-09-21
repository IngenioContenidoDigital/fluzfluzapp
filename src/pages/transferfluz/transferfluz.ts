import { Component, trigger, style, animate, state, transition  } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { TabsService } from '../../providers/tabs.service';
import { Storage } from '@ionic/storage';
import { MyAccountService } from '../../providers/myAccount.service';
import { TransferFluzService } from '../../providers/transferfluz.service';
import { TransferFluzConfirmPage } from '../transferfluz-confirm/transferfluz-confirm';
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the TransferFluz page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-transferfluz',
  templateUrl: 'transferfluz.html',
  providers: [ MyAccountService,TransferFluzService ],
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
export class TransferFluzPage {

    public userData:any = {};
    public searchBox:string = "";
    public fluzzers:any = [];
    public fluzzerSelected:string = "";
    public valueTransfer:any = 0;
    public displayTransferFluz:any = false;
    public notFound:any = false;
  
  
    constructor(public loadingController: LoadingController, public navCtrl: NavController, public navParams: NavParams, public tabsService: TabsService, public storage: Storage, public myAccount: MyAccountService, public transferFluz: TransferFluzService, private alertCtrl: AlertController) {
    }
    
    ionViewWillEnter(){
        this.getUserData();
        this.tabsService.hide();
    }

    ionViewWillLeave(){
        this.tabsService.show();
    }

    getUserData() {
        this.storage.get('userData').then((val) => {
            if( val != null && val != '' && val != undefined ){
                this.userData.userName = val.firstname;
                this.myAccount.getDataAccount(val.id).then(
                    (data:any) => {
                        this.userData = Object.assign(this.userData, JSON.parse(data));
                        this.userData.fluzLasted === null ? this.userData.fluzLasted = 0 : this.userData.fluzLasted = this.userData.fluzLasted;
                    }
                );
            }
        });
    }

    enableTransfer() {
        if ( this.valueTransfer > 0 && this.fluzzerSelected != "" ) {
            this.displayTransferFluz = true;
        } else {
            this.displayTransferFluz = false;
        }
    }

    searchFluzzer() {
        this.fluzzers = [];
        this.fluzzerSelected = "";
        this.notFound = false;
        setTimeout(()=>{
          this.storage.get('userData').then(
            (userData:any) => {
              if ( this.searchBox != "" ) {
                  this.transferFluz.searchFluzzers(this.searchBox, userData.id).subscribe(
                      success => {
                          let response = JSON.parse(success._body);
                          if ( response.success ) {
                              this.fluzzers = response.fluzzers;
                          } else {
                              this.notFound = true;
                          }
                      },
                      error => {
                          console.log(error)
                      }
                  );
              }
            }
          );
        }, 500);
        this.enableTransfer();
    }

    transfer() {
        this.storage.get('userData').then((userData) => {
            this.displayTransferFluz = false;
            let loader = this.loadingController.create({
                content: "Transfiriendo Fluz..."
            });
            loader.present();
            this.transferFluz.transferFluz(userData.id, this.fluzzerSelected, this.valueTransfer).subscribe(
                success => {
                    loader.dismiss();
                    let response = JSON.parse(success._body);
                    if ( response.success ) {
                        this.searchBox = "";
                        this.fluzzers = [];
                        this.fluzzerSelected = "";
                        this.valueTransfer = 0;
                        this.displayTransferFluz = false;
                        this.notFound = false;
                        this.getUserData();
                        this.enableTransfer();
                        this.navCtrl.push(TransferFluzConfirmPage,{data: response.data});
                    } else {
                        this.displayTransferFluz = true;
                        let alert = this.alertCtrl.create({
                            title: 'Error Generando Transferencia',
                            subTitle: 'Ha ocurrido un error en el proceso de transferencia de fluz.',
                            buttons: ['OK']
                        });
                        alert.present();
                    }
                },
                error => {
                    console.log(error)
                }
            );
        });
    }
}
