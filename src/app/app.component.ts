import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { AnalyticsService } from '../providers/analytics.service';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AlertController } from 'ionic-angular';

@Component({
  templateUrl: 'app.html',
  providers: [AnalyticsService, Push]
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor( private alertCtrl: AlertController, private push: Push, public analytics: AnalyticsService, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.analytics.analytictsStart();
      this.pushsetup();
    });
  }

  pushsetup() {
    const options: PushOptions = {
     android: {
       clearNotifications: true
     },
     ios: {
         alert: 'true',
         badge: true,
         sound: 'false'
     },
     windows: {}
  };
 
  const pushObject: PushObject = this.push.init(options);
 
  pushObject.on('notification').subscribe((notification: any) => {
    if (notification.additionalData.foreground) {
      let youralert = this.alertCtrl.create({
        title: (notification.title || notification.title == '' || notification.title == null) ? 'Mensaje de Fluz FLuz' : notification.title,
        message: notification.message,
        buttons: ['Ok']
      });
      youralert.present();
    }
  });
 
  pushObject.on('registration').subscribe((registration: any) => {
     //do whatever you want with the registration ID
  });
 
  pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
  }
  
}
