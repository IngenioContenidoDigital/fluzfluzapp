import { Component, ViewChild, trigger, style, animate, state, transition } from '@angular/core';
import { NavController, Slides, LoadingController, ModalController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ConfirmPage } from '../confirm/confirm';
import { CategoryPage } from '../category/category';
import { CategoriesPage } from '../categories/categories';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyAccountService } from '../../providers/myAccount.service';
import { HomeService } from '../../providers/home.service';
import { AnalyticsService } from '../../providers/analytics.service';
import { InvitationThirdModalPage } from '../invitation-third-modal/invitation-third-modal';
import { CategoryService } from '../../providers/category.service';
import { TabsService } from '../../providers/tabs.service';
import { ProductChildPage } from '../product-child/product-child';
import { TutorialPage } from '../tutorial/tutorial';
import { ReactiveAccountPage } from '../reactive-account/reactive-account';
import { SHOW_HOME_CATEGORY } from '../../providers/config';
import { SHOW_LASTED_FLUZ } from '../../providers/config';
import { DEV_UBICATION } from '../../providers/config';
import { LoginService } from '../../providers/login-service';
import { SearchService } from '../../providers/search.service';
import { StatusBar } from '@ionic-native/status-bar';
import { ProductFatherPage } from '../product-father/product-father';
import { BrowserTab } from '@ionic-native/browser-tab';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [
    MyAccountService,
    HomeService,
    CategoryService,
    SearchService,
    StatusBar,
    AnalyticsService
  ],
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
export class HomePage {
  
  public userData:any = {};
  public showHomeUserData:any = false;
  public bannerData:any = {};
  public categoryFatherData:any = [];
  public categoryWithOutFatherData:any = [];
  public backgroundDefault:any = "https://s3.amazonaws.com/imagenes-fluzfluz/c/3-category_default.jpg";
  public category:any = false;
  public productChild:any = [];
  public countbannerData:any = 0;
  public devUbication:any = DEV_UBICATION;
  public homeCategories:any = SHOW_HOME_CATEGORY;
  public lastedFluz:any = SHOW_LASTED_FLUZ;
  public notificationBar:any = [];
  public profileBar:any = true;
  
  @ViewChild(Slides) slides: Slides;
  
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public splashScreen: SplashScreen,
    public myAccount: MyAccountService,
    public home: HomeService,
    public categoryService: CategoryService,
    public tabsService: TabsService,
    public loadingController: LoadingController,
    public modalCtrl: ModalController,
    public statusBar: StatusBar,
    private browserTab: BrowserTab,
    private iab: InAppBrowser,
    private loginService:LoginService,
    public analytics: AnalyticsService
    
    ) {
      this.notificationBar.alert = 2;
      setTimeout(()=>{
        this.statusBar.backgroundColorByHexString('#E1493A');
      }, 500 );
      this.countbannerData = 0;
      this.tabsService.show();
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
      case "ReactiveAccountPage": {
        this.navCtrl.push( ReactiveAccountPage );
        break;
      }
      case "TutorialPage": {
        this.navCtrl.push( TutorialPage );
        break;
      }
      default: {
        this.navCtrl.pop();        
        break;
      }
    }
  }
  
  ionViewDidLoad() {
    this.getUserData();
    this.getBannerData();
    this.getCategoryWithFatherData();
    this.getCategoryWithOutFatherData();
  }
  
  ionViewWillEnter(){
    this.notificationBar.alert = 2;
    this.analytics.trackView('HomePage');
    this.notificationBar.setVisible = false;
    this.storage.get('tutorial').then((tutorial)=> {
      if(tutorial || tutorial == 'true'){
        this.storage.get('userData').then((val) => {
          this.storage.get('userConfirm').then((userConfirm)=> {
            if (val === null || val === undefined || val === false){
              this.goTo("LoginPage");
            }
            else if( userConfirm !== true ){
              this.goTo("ConfirmPage");            
            }
            if (val === null || val === undefined || val == false){
              this.updateShowDataUser(false);
            }
            else {

              this.updateShowDataUser(true);          
              this.analytics.setUserId(val.id);
//              setTimeout(()=>{
//                this.getUserData();
//                this.getBannerData();
//                this.getCategoryWithFatherData();
//                this.getCategoryWithOutFatherData();
//              }, 100 );
              setTimeout(()=>{
                this.home.getNotificationBarOrders(val.id).then((data:any)=>{
                  let notificationData = data.result;
                  this.notificationBar = data.result;
                  if(this.notificationBar.profile_complete<100){
                    this.profileBar = true;
                  }
                  switch (notificationData.alert){
                    case 4: {
                      this.notificationBar.setVisible = true;
                      this.notificationBar.text = "¡Tu cuenta ha sido desactivada temporalmente!";
                      break;
                    }
                    case 3: {
                      this.notificationBar.setVisible = true;
                      this.notificationBar.text = "Has hecho "+notificationData.orden+" de "+notificationData.quantity_max+" compras y te estas pasando de la fecha de vencimiento. Si no haces "+notificationData.quantity+" compras más hasta el ("+notificationData.dateCancel+") tu cuenta será cancelada!";
                      break;
                    }
                    case 2: {
                      this.notificationBar.setVisible = true;
                      this.notificationBar.text = "Increíble! Tu compra mensual mínima se ha cumplido.";
                      break;
                    }
                    case 1: {
                      this.notificationBar.setVisible = true;
                      this.notificationBar.text = "Has hecho "+notificationData.orden+" de "+notificationData.total+" compras. Necesitaras hacer "+notificationData.quantity+" compras más hasta el ("+notificationData.date+") para cubrir tu requisito mensual";
                      break;
                    }
                    default: {
                      this.notificationBar.setVisible = false;
                      break;
                    }
                  }
                });
                this.countbannerData = Object.keys(this.bannerData).length;
              }, 500 );
            }
          });
        });
      }
      else{
        this.goTo("TutorialPage");
      }
    });
  }
  
  openBanner(banner:any){
    // type_route:
    //   0 producto
    //   1 categoria
    //   2 url
    if(banner.b_link_app != null && banner.b_link_app != 'null' && banner.b_link_app != ''){
      if(banner.type_route == "0"){
        let manufacturer:any = [];
        manufacturer.m_id = banner.b_link_app;
        this.navCtrl.push(ProductFatherPage,{
          manufacturer: manufacturer
        });
      }
      else if(banner.type_route == "1"){
        let category:any = [];
        category.id_category = banner.b_link_app;
        this.categoryService.getNameOneCategoryById(category.id_category).then(
          (data:any) => {
            this.openCategoryById(data);
          }  
        );
      }
      else if(banner.type_route == "2"){
        this.openUrl(banner.b_link_app);
      }
      else {}
    }
  }
  
  openUrl(url:string){
    this.browserTab.isAvailable().then((
      isAvailable: boolean) => {
        if (isAvailable) {
          this.browserTab.openUrl(url);
        } else {
          this.iab.create(url, '_blank', 'location=yes');
          // open URL with InAppBrowser instead or SafariViewController
        }
    });
  }
  
  pushNewUser(){
    this.navCtrl.push(InvitationThirdModalPage);
  }
  
  closeNotification(){
    this.notificationBar.setVisible = false;
  }
  
  closeProfile() {
    this.profileBar = false;
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
      this.storage.get('tokenFCM').then(
        (token:any) =>{
          this.loginService.setTokenFCM(val.id, token).then((result:any)=>{
//            console.log( (result) ? 'Si se actualizo': 'No funciono');
          });
        }
      );
    });
  }
  
  getBannerData() {
    this.home.getBanner().then(
      (data:any) => {
        this.bannerData = data.result;
      }
    );
  }
  
  updateShowDataUser(value:any){
    this.showHomeUserData = value;
  }
  
  getCategoryWithFatherData() {
    this.categoryService.getCategory( 1 ).then(
      (data:any) => {
        this.categoryFatherData = data.result;
      }
    );
  }
  
  getCategoryWithOutFatherData(){
    this.categoryService.getCategory( 2, 0, 4 ).then(
      (data:any) => {
        this.categoryWithOutFatherData = data.result;
      }
    );
  }
  
  openCategoryById( item:any ){
    this.categoryService.getCategory( 3, item.id_category ).then(
      (data:any) => {
        this.navCtrl.push( CategoryPage, {
          category: item,
          products: data.products
        });
      }  
    );
  }
  
  openViewAllCategories(){
   this.categoryService.getCategory( 2 ).then(
      (data:any) => {
        this.navCtrl.push( CategoriesPage, {
          categories: data.result
        });
      }
    );
  }
  
  openProductChild( item:any ) {
    
    this.productChild.image_manufacturer = item.image;
    this.productChild.id_parent = item.pf_id;
    this.productChild.p_name = item.pf_name;
    this.productChild.online_only = item.online_only;
    
    this.navCtrl.push(ProductChildPage,{
      manufacturer: this.productChild,
      productFather: this.productChild
    });
  }
  
  openReactiveAccount(item:any){
    if ( item == 4 ) {
      this.goTo("ReactiveAccountPage");
    }
  }
}
