import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Plugins
import { Network } from '@ionic-native/network';
import { BrowserTab } from '@ionic-native/browser-tab';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/* Pages */
  
  /* Modals */
  import { SearchModalPage } from '../pages/search-modal/search-modal';
  import { CountryModalPage } from '../pages/country-modal/country-modal';
  import { MessageModalPage } from '../pages/message-modal/message-modal';
  
  /* Basicas */
  import { StatusBar } from '@ionic-native/status-bar';
  import { SplashScreen } from '@ionic-native/splash-screen';
  import { TabsService } from '../providers/tabs.service';
  
  /* Principales */
  import { HeaderPage } from '../pages/header/header';
  import { AboutPage } from '../pages/about/about';
  import { ContactPage } from '../pages/contact/contact';
  import { TabsPage } from '../pages/tabs/tabs';
  
  /* TabsPages */
  import { HomePage } from '../pages/home/home';
  import { VaultPage } from '../pages/vault/vault';
  import { RedemptionPage } from '../pages/redemption/redemption';
  import { NetworkPage } from '../pages/network/network';
  import { MorePage } from '../pages/more/more';
  
  /* Login */
    import { LoginPage } from '../pages/login/login';
    import { ConfirmPage } from '../pages/confirm/confirm';
    import { ConfirmatedPage } from '../pages/confirmated/confirmated';

  /* Product */
    import { ProductFatherPage } from '../pages/product-father/product-father';
    import { ProductChildPage } from '../pages/product-child/product-child';
    import { CategoryPage } from '../pages/category/category';
    import { CategoriesPage } from '../pages/categories/categories';
  
  /* Pagos */
    import { CartPage } from '../pages/cart/cart';
    import { CheckoutPage } from '../pages/checkout/checkout';
    import { PaymentFluzPage } from '../pages/paymentfluz/paymentfluz';
    import { CreditCardPage } from '../pages/creditcard/creditcard';
    import { PaymentPsePage } from '../pages/paymentpse/paymentpse';
    
    import { FormOfRedemptionPage } from '../pages/formofredemption/formofredemption';
    import { RedemptionConfirmPage } from '../pages/redemption-confirm/redemption-confirm';
    
  /* Billetera */
    import { PasscodePage } from '../pages/passcode/passcode';
    import { BonusPage } from '../pages/bonus/bonus';
    
  /* Nuevos Usuarios */
        import { InvitationThirdModalPage } from '../pages/invitation-third-modal/invitation-third-modal';

    
  
    
@NgModule({
  declarations: [
    MyApp,
    HeaderPage,
    AboutPage,
    ContactPage,
    TabsPage,
    HomePage,
    VaultPage,
    RedemptionPage,
    NetworkPage,
    MorePage,
    LoginPage,
    ConfirmPage,
    ConfirmatedPage,
    SearchModalPage,
    CountryModalPage,
    MessageModalPage,
    InvitationThirdModalPage,
    ProductFatherPage,
    ProductChildPage,
    CartPage,
    CheckoutPage,
    PaymentFluzPage,
    CreditCardPage,
    PaymentPsePage,
    PasscodePage,
    BonusPage,
    CategoryPage,
    CategoriesPage,
    FormOfRedemptionPage,
    RedemptionConfirmPage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: false,
      tabsPlacement: 'bottom',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      pageTransition: 'ios-transition'
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HeaderPage,
    AboutPage,
    ContactPage,
    TabsPage,
    HomePage,
    VaultPage,
    RedemptionPage,
    InvitationThirdModalPage,
    NetworkPage,
    MorePage,
    LoginPage,
    ConfirmPage,
    ConfirmatedPage,
    SearchModalPage,
    CountryModalPage,
    MessageModalPage,
    ProductFatherPage,
    ProductChildPage,
    CartPage,
    CheckoutPage,
    PaymentFluzPage,
    CreditCardPage,
    PaymentPsePage,
    PasscodePage,
    BonusPage,
    CategoryPage,
    CategoriesPage,
    FormOfRedemptionPage,
    RedemptionConfirmPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TabsService,
    BrowserTab,
    InAppBrowser,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
//    Storage
  ]
})
export class AppModule {}
