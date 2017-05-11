import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

/* Pages */
  
  /* Basicas */
  import { StatusBar } from '@ionic-native/status-bar';
  import { SplashScreen } from '@ionic-native/splash-screen';
  import { TabsService } from '../providers/tabs.service';
  
  /* Principales */
  import { AboutPage } from '../pages/about/about';
  import { ContactPage } from '../pages/contact/contact';
  import { HomePage } from '../pages/home/home';
  import { TabsPage } from '../pages/tabs/tabs';
  
  /* Login */
    import { LoginPage } from '../pages/login/login';
    import { ConfirmPage } from '../pages/confirm/confirm';
    import { ConfirmatedPage } from '../pages/confirmated/confirmated';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    ConfirmPage,
    ConfirmatedPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    ConfirmPage,
    ConfirmatedPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TabsService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Storage
  ]
})
export class AppModule {}
