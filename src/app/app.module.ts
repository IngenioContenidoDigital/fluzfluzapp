import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { FCM } from '@ionic-native/fcm';

//import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';


// Plugins
import { Network } from '@ionic-native/network';
import { BrowserTab } from '@ionic-native/browser-tab';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/* Pages */
  
  /* Modals */
  import { SearchModalPage } from '../pages/search-modal/search-modal';
  import { CountryModalPage } from '../pages/country-modal/country-modal';
  import { MessageModalPage } from '../pages/message-modal/message-modal';
  import { MessagesModalPage } from '../pages/messages-modal/messages-modal';
  import { ProfileModalPage } from '../pages/profile-modal/profile-modal';
  import { GiftModalPage } from '../pages/gift-modal/gift-modal';
  import { VoucherModalPage } from '../pages/voucher-modal/voucher-modal';
  import { SupportModalPage } from '../pages/support-modal/support-modal';
  
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
  import { MapPage } from '../pages/map/map';
  import { RedemptionPage } from '../pages/redemption/redemption';
  import { NetworkPage } from '../pages/network/network';
  import { NetworkTreePage } from '../pages/network-tree/network-tree';
  import { MorePage } from '../pages/more/more';
  
  /* Login */
    import { LoginPage } from '../pages/login/login';
    import { RegisterPage } from '../pages/register/register';
    import { ConfirmPage } from '../pages/confirm/confirm';
    import { ConfirmatedPage } from '../pages/confirmated/confirmated';

  /* Product */
    import { ProductModalPage } from '../pages/product-modal/product-modal';
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
    import { BitPayPage } from '../pages/bitpay/bitpay';
    
    import { FormOfRedemptionPage } from '../pages/formofredemption/formofredemption';
    import { RedemptionConfirmPage } from '../pages/redemption-confirm/redemption-confirm';
    
  /* Bóveda */
    import { PasscodePage } from '../pages/passcode/passcode';
    import { BonusPage } from '../pages/bonus/bonus';
    import { ResetPasscodePage } from '../pages/reset-passcode/reset-passcode';
    import { RenewPasscodeConfirmPage } from '../pages/renew-passcode-confirm/renew-passcode-confirm';
    
  /* Nuevos Usuarios */
    import { InvitationThirdModalPage } from '../pages/invitation-third-modal/invitation-third-modal';
  
  /* Transferencia de Fluz */
    import { TransferFluzPage } from '../pages/transferfluz/transferfluz';
    import { TransferFluzConfirmPage } from '../pages/transferfluz-confirm/transferfluz-confirm';
        
  /* Informacion Personal */
    import { PersonalInformationPage } from '../pages/personalinformation/personalinformation';

  /* Mensajes */
    import { MessagesPage } from '../pages/messages/messages';
  
  
    
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
    NetworkTreePage,
    MorePage,
    LoginPage,
    RegisterPage,
    ConfirmPage,
    ConfirmatedPage,
    SearchModalPage,
    CountryModalPage,
    MessageModalPage,
    ProfileModalPage,
    GiftModalPage,
    VoucherModalPage,
    SupportModalPage,
    InvitationThirdModalPage,
    ProductFatherPage,
    ProductModalPage,
    ProductChildPage,
    CartPage,
    CheckoutPage,
    PaymentFluzPage,
    CreditCardPage,
    PaymentPsePage,
    BitPayPage,
    PasscodePage,
    BonusPage,
    ResetPasscodePage,
    RenewPasscodeConfirmPage,
    CategoryPage,
    CategoriesPage,
    FormOfRedemptionPage,
    RedemptionConfirmPage,
    TransferFluzPage,
    TransferFluzConfirmPage,
    PersonalInformationPage,
    MessagesPage,
    MapPage,
    MessagesModalPage
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
    NetworkTreePage,
    MorePage,
    LoginPage,
    RegisterPage,
    ConfirmPage,
    ConfirmatedPage,
    SearchModalPage,
    CountryModalPage,
    MessageModalPage,
    ProfileModalPage,
    GiftModalPage,
    VoucherModalPage,
    SupportModalPage,
    ProductFatherPage,
    ProductModalPage,
    ProductChildPage,
    CartPage,
    CheckoutPage,
    PaymentFluzPage,
    CreditCardPage,
    PaymentPsePage,
    BitPayPage,
    PasscodePage,
    BonusPage,
    ResetPasscodePage,
    RenewPasscodeConfirmPage,
    CategoryPage,
    CategoriesPage,
    FormOfRedemptionPage,
    RedemptionConfirmPage,
    TransferFluzPage,
    TransferFluzConfirmPage,
    PersonalInformationPage,
    MessagesPage,
    MapPage,
    MessagesModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TabsService,
    BrowserTab,
    InAppBrowser,
    Network,
    Geolocation,
    GoogleMaps,
    GoogleAnalytics,
    Facebook,
    GooglePlus,
    FCM,
    Camera,
    File,
    FilePath, 
    FileTransfer,
//    FirebaseAnalytics,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
//    Storage
  ]
})
export class AppModule {}
