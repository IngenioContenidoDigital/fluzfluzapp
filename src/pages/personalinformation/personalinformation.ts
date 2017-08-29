import { Component, trigger, style, animate, state, transition  } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TabsService } from '../../providers/tabs.service';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { PersonalInformationService } from '../../providers/personalinformation.service';

/**
 * Generated class for the PersonalInformation page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-personalinformation',
  templateUrl: 'personalinformation.html',
  providers: [ PersonalInformationService ],
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
export class PersonalInformationPage {
    
    personalInformationForm: FormGroup;

    public titlesegments:string = "Información Basica";
    private enabledSaveButton:boolean = false;
    public phoneProviders:any = [];
    public cities:any = [];
    public userData:any = [];
    
    constructor(public loadingController: LoadingController, public navCtrl: NavController, formBuilder: FormBuilder, public navParams: NavParams, public tabsService: TabsService, public storage: Storage, private alertCtrl: AlertController, private personalInformationService: PersonalInformationService ) {
        this.userData = navParams.get("customer");
          this.personalInformationForm = formBuilder.group({
            'segmentselected': ["basic", Validators.compose([Validators.required])],
            
            'id_gender': [null, Validators.compose([Validators.required])],
            'firstname': [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{2,100}$/i)])],
            'lastname': [null, Validators.compose([Validators.required, Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{2,100}$/i)])],
            'email': [{value: null, disabled: true}, Validators.compose([Validators.required])],
            'dni': [{value: null, disabled: true}, Validators.compose([Validators.required, Validators.pattern(/^[0-9]{5,15}$/i)])],
            'birthday': [null, Validators.compose([Validators.required])],
            'civil_status': [null, Validators.compose([])],
            'occupation_status': [null, Validators.compose([])],
            /*'field_work': [null, Validators.compose([])],*/
            'pet': [null, Validators.compose([])],
            'pet_name': [null, Validators.compose([])],
            'spouse_name': [null, Validators.compose([Validators.pattern(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{2,100}$/i)])],
            'children': [null, Validators.compose([Validators.pattern(/^[0-9]{1,2}$/i)])],
            'phone_provider': [null, Validators.compose([])],
            'phone': [null, Validators.compose([Validators.required, Validators.pattern(/^[0-9]{8,15}$/i)])],
            'address1': [null, Validators.compose([Validators.required])],
            'address2': [null, Validators.compose([Validators.required])],
            'city': [null, Validators.compose([Validators.required])],
        });
    }
    
    ionViewWillEnter(){
        this.tabsService.hide();
        this.getPhoneProviders();
        this.getCities();
        this.getPersonalInformation();
    }

    ionViewWillLeave(){
        this.tabsService.show();
    }
    
    getPhoneProviders(){
        this.personalInformationService.getPhoneProviders().subscribe(
            success => {
                if(success.status === 200) {
                    let response = JSON.parse(success._body);
                    this.phoneProviders = response;
                }
            },
            error => {
                this.tabsService.changeTabInContainerPage(0);
                this.navCtrl.setRoot(TabsPage);
                console.log(error);
            }
        );
    }

    getCities(){
        this.personalInformationService.getCities().subscribe(
            success => {
                if(success.status === 200) {
                    let response = JSON.parse(success._body);
                    this.cities = response;
                }
            },
            error => {
                this.tabsService.changeTabInContainerPage(0);
                this.navCtrl.setRoot(TabsPage);
                console.log(error);
            }
        );
    }
    
    getPersonalInformation(){
        let loader = this.loadingController.create({
            content: "Cargando Información..."
        });
        loader.present();
        this.storage.get('userData').then((userData) => {
            this.personalInformationService.getPersonalInformation(userData.id).subscribe(
                success => {
                    if(success.status === 200) {
                        let response = JSON.parse(success._body);
                        this.personalInformationForm.get('id_gender').setValue(response.id_gender);
                        this.personalInformationForm.get('firstname').setValue(response.firstname);
                        this.personalInformationForm.get('lastname').setValue(response.lastname);
                        this.personalInformationForm.get('email').setValue(response.email);
                        this.personalInformationForm.get('dni').setValue(response.dni);
                        this.personalInformationForm.get('birthday').setValue(response.birthday);
                        this.personalInformationForm.get('civil_status').setValue(response.civil_status);
                        this.personalInformationForm.get('occupation_status').setValue(response.occupation_status);
                        /*this.personalInformationForm.get('field_work').setValue(response.field_work);*/
                        this.personalInformationForm.get('pet').setValue(response.pet);
                        this.personalInformationForm.get('pet_name').setValue(response.pet_name);
                        this.personalInformationForm.get('spouse_name').setValue(response.spouse_name);
                        this.personalInformationForm.get('children').setValue(response.children);
                        this.personalInformationForm.get('phone_provider').setValue(response.phone_provider);
                        this.personalInformationForm.get('phone').setValue(response.phone);
                        this.personalInformationForm.get('address1').setValue(response.address1);
                        this.personalInformationForm.get('address2').setValue(response.address2);
                        this.personalInformationForm.get('city').setValue(response.city);
                    }
                },
                error => {
                    this.tabsService.changeTabInContainerPage(0);
                    this.navCtrl.setRoot(TabsPage);
                    console.log(error);
                }
            );
        });
        loader.dismiss();
    }
    
    changePassword(dataForm:any):void {
        let alert = this.alertCtrl.create({
            title: 'Información Personal',
            subTitle: "Cambio de contraseña",
            inputs: [
                {
                    name: 'password_new',
                    placeholder: 'Nueva Contraseña',
                    type: 'password'
                },
                {
                    name: 'password_confirm',
                    placeholder: 'Confirmar Contraseña',
                    type: 'password'
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: 'Continuar',
                    handler: changepass => {
                        if ( changepass.password_new != changepass.password_confirm || changepass.password_new.length < 6 || changepass.password_new == "" || changepass.password_confirm == "" ) {
                            let alert = this.alertCtrl.create({
                                title: 'Contraseña Incorrecta',
                                subTitle: "La nueva contraseña no coincide o es muy corta.",
                                buttons: ['OK']
                            });
                            alert.present();
                        } else {
                            dataForm.password_new = changepass.password_new;
                            this.save(dataForm);
                        }
                        
                    }
                }
            ]
        });
        alert.present();
    }

    save(dataForm:any):void {
        let alert = this.alertCtrl.create({
            title: 'Información Personal',
            subTitle: "Confirma tu contraseña actual para almacenar tu información",
            inputs: [{
                name: 'password',
                placeholder: 'Contraseña',
                type: 'password'
            }],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: 'Continuar',
                    handler: confirm => {
                        dataForm.password = confirm.password;
                        this.saveInformation(dataForm);
                    }
                }
            ]
        });
        alert.present();
    }
    
    saveInformation(dataForm:any):void {
        this.storage.get('userData').then((userData) => {
            let loader = this.loadingController.create({
                content: "Guardando..."
            });
            loader.present();
            this.enabledSaveButton = false;
            this.personalInformationService.save(userData.id, dataForm).subscribe(
                success => {
                    if(success.status === 200) {
                        loader.dismiss();
                        let response = JSON.parse(success._body);
                        if ( response.success ) {
                            let alert = this.alertCtrl.create({
                                title: 'Actualización Exitosa',
                                subTitle: "Información Personal Almacenada.",
                                buttons: ['OK']
                            });
                            alert.present();
                        } else {
                            this.enabledSaveButton = true;
                            let alert = this.alertCtrl.create({
                                title: 'Error Almacenando Información',
                                subTitle: response.error,
                                buttons: ['OK']
                            });
                            alert.present();
                        }
                    }
                }
            );
        });
    }
    
    validateInput(event:any) {
        if (
            this.personalInformationForm.controls['segmentselected'].valid &&
            this.personalInformationForm.controls['id_gender'].valid &&
            this.personalInformationForm.controls['firstname'].valid 
//            this.personalInformationForm.controls['lastname'].valid &&
//            this.personalInformationForm.controls['email'].valid &&
//            this.personalInformationForm.controls['dni'].valid &&
//            this.personalInformationForm.controls['birthday'].valid &&
//            this.personalInformationForm.controls['civil_status'].valid &&
//            this.personalInformationForm.controls['occupation_status'].valid &&
//            /*this.personalInformationForm.controls['field_work'].valid &&*/
//            this.personalInformationForm.controls['pet'].valid &&
//            this.personalInformationForm.controls['pet_name'].valid &&
//            this.personalInformationForm.controls['spouse_name'].valid &&
//            this.personalInformationForm.controls['children'].valid &&
//            this.personalInformationForm.controls['phone_provider'].valid &&
//            this.personalInformationForm.controls['phone'].valid &&
//            this.personalInformationForm.controls['address1'].valid &&
//            this.personalInformationForm.controls['address2'].valid &&
//            this.personalInformationForm.controls['city'].valid
        ) {
            this.enabledSaveButton = true;
        } else {
            this.enabledSaveButton = false;
        }
    }
    
    changeSegmentSelected() {
        switch( this.personalInformationForm.value['segmentselected'] ) {
            case "basic":
                this.titlesegments = "Información Basica";
                break;
            case "complementary":
                this.titlesegments = "Información Complementaria";
                break;
            case "location":
                this.titlesegments = "Información Localización";
                break;
        }
    }
}
