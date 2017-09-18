import { Component } from '@angular/core';
import { NavController, Platform, NavParams, LoadingController, ToastController, ActionSheetController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { TransferFluzPage } from '../transferfluz/transferfluz';
import { PersonalInformationPage } from '../personalinformation/personalinformation';
import { MessagesPage } from '../messages/messages';
import { ConfirmPage } from '../confirm/confirm';
import { ConfirmatedPage } from '../confirmated/confirmated';
import { MyAccountService } from '../../providers/myAccount.service';
import { MessagesService } from '../../providers/messages.service';
import { Storage } from '@ionic/storage';
import { LoginService } from '../../providers/login-service';
import { SHOW_MORE_OPTIONS } from '../../providers/config';
import { SHOW_SAVINGS } from '../../providers/config';
import { SHOW_LASTED_FLUZ } from '../../providers/config';
import { RedemptionPage } from '../redemption/redemption';

import { WS_BASE } from '../../providers/config';

import { Camera } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

declare var cordova: any;

@Component({
  selector: 'page-more',
  templateUrl: 'more.html',
  providers: [MyAccountService,LoginService,MessagesService,Camera,File,FileTransfer]
})
export class MorePage {

  public userData:any = {};
  public showOptions:any = SHOW_MORE_OPTIONS;
  public showSavings:any = SHOW_SAVINGS;
  public lastedFluz:any = SHOW_LASTED_FLUZ;
  
  public lastImage: string = null;
  
  constructor( public platform: Platform, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, private filePath: FilePath, private transfer: FileTransfer, private file: File, private camera: Camera, public loadingController: LoadingController, public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public myAccount: MyAccountService, private loginService:LoginService, public messagesService: MessagesService) {
  }
  

  ionViewWillEnter(){
    this.getUserData();
  }
  
  getUserData() {
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.userData.userName = val.firstname;
        this.userData.id = val.id;
        this.myAccount.getDataAccount(val.id).then(
          (data:any) => {
//            console.log(data);
            this.userData = Object.assign(this.userData, JSON.parse(data));
            this.userData.fluzLasted === null ? this.userData.fluzLasted = 0 : this.userData.fluzLasted = this.userData.fluzLasted;
          }
        );
      }
    });
  }
  
  logout(){
    let loader = this.loadingController.create({
      content: "Cerrando sesión..."
    });
    loader.present();
    this.loginService.logout().then(
      (data:boolean) => {
        loader.dismiss();
        if ( data ){
          this.storage.set('userData', false);
        }
      }
    );
    setTimeout(()=>{ this.goTo('LoginPage') }, 100);
  }
  
  goTo(value:any) {
    
    switch (value){
      
      case "ConfirmPage": {
        this.navCtrl.push( ConfirmPage );
        break;
      }
      
      case "LoginPage": {
        this.navCtrl.push( LoginPage );
        break;
      }
      
      case "ConfirmatedPage": {
        this.navCtrl.push( ConfirmatedPage );
        break;
      }
      
      case "TransferFluzPage": {
        this.navCtrl.push( TransferFluzPage );
        break;
      }
      
      case "PersonalInformationPage": {
        this.navCtrl.push( PersonalInformationPage, {customer: this.userData} );
        break;
      }
      
      case "MessagesPage": {
        this.navCtrl.push( MessagesPage );
        break;
      }
      
      case "RedemptionPage": {
        this.navCtrl.push( RedemptionPage );
        break;
      }
      
      default: {
        this.navCtrl.pop();        
        break;
      }
      
    }
  }
  
  profilePicture(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Cambiar foto de Perfil.',
      buttons: [
        {
          text: 'Subir una foto',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Hacer una nueva foto',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  
  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      targetWidth: 400,
      targetHeight: 400,
      allowEdit: true
    };

    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error seleccionando la imagen.');
    });
  }
  
  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }

  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      setTimeout(()=>{
        this.uploadImage();
      }, 200);
    }, error => {
      this.presentToast('Error almacenando archivo.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }
  
  
  public uploadImage() {
    // Destination URL
    var url = WS_BASE+"/profileImage";

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: "file",
      fileName: this.userData.id,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename}
    };

    const fileTransfer: FileTransferObject = this.transfer.create();

    let loading = this.loadingController.create({
      content: 'actualizando...',
    });
    loading.present();

    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options, true).then(data => {
      loading.dismissAll();
      this.presentToast('Se ha cargado correctamente tu foto.');
      this.userData.image = "";
      setTimeout(()=>{
        this.getUserData();
      }, 2000);
    }, err => {
      loading.dismissAll();
      this.presentToast('Error cargando tu foto de perfil.');
    });
  }
  
  
  
}
