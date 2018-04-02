import { Component, trigger, style, animate, state, transition, ViewChild, ElementRef } from '@angular/core';
import { ModalController, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { NetworkService } from '../../providers/network.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { MyAccountService } from '../../providers/myAccount.service';
import { MessageModalPage } from '../message-modal/message-modal';
import { InvitationThirdModalPage } from '../invitation-third-modal/invitation-third-modal';
import { NetworkTreePage } from '../network-tree/network-tree';
import { SHOW_REFINE_BUTTONS } from '../../providers/config';
import { SHOW_LASTED_FLUZ } from '../../providers/config';
import { ProductChildPage } from '../product-child/product-child';
import { ProductFatherPage } from '../product-father/product-father';
import { MorePage } from '../more/more';
import { ProfileModalPage } from '../profile-modal/profile-modal';
import { SearchService } from '../../providers/search.service';
import { AnalyticsService } from '../../providers/analytics.service';

@Component({
  selector: 'page-network',
  templateUrl: 'network.html',
  providers: [
    NetworkService, 
    MyAccountService,
    SearchService,
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
export class NetworkPage {
  
  public activityNetwork:any = [];
  public myNetwork:any = [];
  public myInvitation:any = [];
  public showHomeUserData:any = false;
  public userData:any = {};
  public seeMoreActivityValue:any;
  public seeMoreMyValue:any;
  public countInvitation:any;
  public countActivity:any;
  public totalActivity:any;
  public countMy:any;
  public enabledLoginButton:boolean;
  public contPending:number = 0;
  public contConfirm:number = 0;
  public showRefine:any = SHOW_REFINE_BUTTONS;
  public lastedFluz:any = SHOW_LASTED_FLUZ;
  invitationForm: FormGroup;
  // Busqueda Fluzzers
  public searchTermFluzzer:any = '' ;
  public filterFluzzers:any = null;
  
  //Graphic Start
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @ViewChild('content') content;
  @ViewChild('myScroll') myScroll;
  public center = 400;
  public maxArea:any = 14;
  public radius = 0;
  public MinRadius:any = 50;
  public MaxRadius:any = 0;
  public lastItem:any;
  public imgUrls:any = [];
  public img:any = [];
  public CanvasWidth:any = 320;
  public CanvasHeight:any = 200;
  public CanvasCenter:any = {
    x: 160,
    y: 100
  };
  public networkG:any;
  //Graphic End
  
  constructor(
    public searchService: SearchService,
    public loadingController: LoadingController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams, formBuilder: FormBuilder,
    public network: NetworkService,
    public storage: Storage,
    public myAccount: MyAccountService,
    public analytics: AnalyticsService
  ) {
    this.invitationForm = formBuilder.group({
      'email' : [null, Validators.compose([Validators.required, Validators.pattern(/^[a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]+[.a-z\p{L}0-9!#$%&\'*+\/=?^`{}|~_-]*@[a-z\p{L}0-9]+(?:[.]?[_a-z\p{L}0-9-])*\.[a-z\p{L}0-9]+$/i)])],
      'name': [null, Validators.required],
      'lastname': [null, Validators.required]
    });
    this.imgUrls[0] = "assets/img/user-red.png";
    this.imgUrls[1] = "assets/img/quadrant-1.png";
    this.imgUrls[2] = "assets/img/quadrant-2.png";
    this.imgUrls[3] = "assets/img/quadrant-3.png";
    this.imgUrls[4] = "assets/img/quadrant-4.png";
        
    for(var i=0; i<Object.keys(this.imgUrls).length; i++){
      this.img[i] = new Image();
      this.img[i].src = this.imgUrls[i];
    }
    
//    setTimeout(()=>{ this.getNetworkGUsers() }, 200 );
  }
  
  ionViewWillEnter(){
    this.analytics.trackView('NetworkPage');
    this.storage.get('userData').then((val) => {
      if (val === null || val === undefined || val == false){
        this.updateShowDataUser(false);
      }
      else {
        this.updateShowDataUser(true);
      }
    })
    .catch(error =>{
      console.log(error);
    });
    this.getUserData();
    this.seeMoreActivityValue = 5;
    this.seeMoreMyValue = 5;
    this.countInvitation = 2;
    this.countMy = 0;
    if( ( Object.keys(this.activityNetwork).length ) >= 5 ){
      this.activityNetwork = [];
    }
    if( ( Object.keys(this.myNetwork).length ) > 5 ){
      this.myNetwork = [];
    }
    if( ( Object.keys(this.myInvitation).length ) <= 2  ){
      this.myInvitation = [];
      this.contPending = 0;
      this.contConfirm = 0;
    }
    setTimeout(()=>{
      this.getActivityNetworkData( this.seeMoreActivityValue );
      this.getMyNetworkData( this.seeMoreMyValue );
      this.getMyInvitationData(this.countInvitation);
      this.resetVariables();
//      this.getNetworkGUsers();
    }, 200);
  }
  
  resetVariables(){
    this.center = 400;
    this.maxArea= 14;
    this.radius = 0;
    this.MinRadius= 50;
    this.MaxRadius= 0;
    this.lastItem = [];
    this.CanvasWidth= 320;
    this.CanvasHeight= 200;
    this.CanvasCenter= {
      x: 160,
      y: 100
    };
    this.networkG = [];
    setTimeout(()=>{ this.getNetworkGUsers(); }, 200);
  }
  
  updateShowDataUser(value:any){
    this.showHomeUserData = value;
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
        )
        .catch(error =>{
          console.log(error);
        });
      }
    })
    .catch(error =>{
      console.log(error);
    });
  }
  
  getActivityNetworkData( limit:any ) {
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.countActivity = Object.keys(this.activityNetwork).length;
        this.network.getDataAccount(val.id, 1, limit, this.countActivity).then(
          (data:any) => {
            var data = JSON.parse(data);
            this.totalActivity = data.total;
            var result = data.result;
            for (let i in result) {
              this.activityNetwork.push(result[i]);
            }
            setTimeout(()=>{ this.countActivity = Object.keys(this.activityNetwork).length; }, 100);
          }
        )
        .catch(error =>{
          console.log(error);
        });
      }
    })
    .catch(error =>{
      console.log(error);
    });
  }
  
  getMyNetworkData( limit:any ){
    let loader = this.loadingController.create({
      content: "Cargando..."
    });
    loader.present();
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.countMy = Object.keys(this.myNetwork).length;
        this.network.getDataAccount(val.id, 2, limit, this.countMy).then(
          (data:any) => {
            loader.dismiss();
            var data = JSON.parse(data);
            for (let i in data) {
              this.myNetwork.push(data[i]);
            }
          }
        )
        .catch(error =>{
          console.log(error);
        });
      }
    })
    .catch(error =>{
      console.log(error);
    });
  }
  
  getMyInvitationData(limit:any){
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.countMy = Object.keys(this.myInvitation).length;
        this.network.getDataAccount(val.id, 3, limit, this.countMy).then(
          (data:any) => {
            var data = JSON.parse(data);
            if(data == ''){
                this.myInvitation.push(data);
            }
            else{
                for (let i in data) {
                    if(data[i]['status']=='Pendiente'){
                        this.contPending += 1;
                    }
                    else if(data[i]['status']=='Confirmado'){
                        this.contConfirm += 1;
                    }
                    this.myInvitation.push(data[i]);
                }
            }
          }
        )
        .catch(error =>{
          console.log(error);
        });
      }
    })
    .catch(error =>{
      console.log(error);
    });
  }
  
  validateInputLogin(event:any) {
    if(this.invitationForm.controls['email'].valid && this.invitationForm.controls['name'].valid) {
      this.enabledLoginButton = true;
    }
    else {
      this.enabledLoginButton = false;
    }      
  }
  
  onSubmit({value}) {
      if (this.invitationForm.controls['email'].valid && this.invitationForm.controls['name'].valid && this.invitationForm.controls['lastname'].valid) {
          
          this.storage.get('userId').then((val) => {
            if( val != null && val != '' && value != '' && val != undefined ){
              let obj = JSON.stringify(value);
              let loader = this.loadingController.create({
                content: "Enviando..."
              });
              loader.present();
              this.network.getDataAccount(val, 5, 0, 0, obj).then(
                (data:any) => {
                  if(data == "Invitacion Erronea: Este Mail ya Existe"){
                    let toast = this.toastCtrl.create({
                      message: data,
                      duration: 2500,
                      position: 'middle'
                    });
                    loader.dismiss();
                    toast.present();
                  }
                  else{
                    let toast = this.toastCtrl.create({
                      message: data,
                      duration: 2500,
                      position: 'middle'
                    });
                      loader.dismiss();
                      toast.present();  
                      this.navCtrl.setRoot(NetworkPage); 
                  }
                  
                }
              )
              .catch(error =>{
                console.log(error);
              });
            }
          })
          .catch(error =>{
            console.log(error);
          });
        }
  }
  
  pushNewUser(){
      this.navCtrl.push(InvitationThirdModalPage);
  }
    
  seeMoreActivity(){
    this.seeMoreActivityValue = ( this.seeMoreActivityValue + 5 );
    setTimeout(()=>{ this.getActivityNetworkData( this.seeMoreActivityValue );  }, 100);
  }
  
  seeMoreMy() {
    this.seeMoreMyValue = ( this.seeMoreMyValue + 5 );
    setTimeout(()=>{ this.getMyNetworkData( this.seeMoreMyValue );  }, 100);
  }
  
  sendMessage(item:any){
    let messageModal = this.modalCtrl.create( MessageModalPage, { destiny: item } );
    messageModal.onDidDismiss(data => {
    });
    messageModal.present();
  }
  
  openNetworkTree() {
    let loader = this.loadingController.create({
      content: "Cargadando..."
    });
    loader.present();
    this.storage.get('userData').then((val) => {
      if( val != null && val != '' && val != undefined ){
        this.countMy = Object.keys(this.myNetwork).length;
        this.network.getDataAccount(val.id, 2, 0, 0).then(
          (data:any) => {
            loader.dismiss();
            var data = JSON.parse(data);
            this.navCtrl.push( NetworkTreePage,{
              tree: data
            });
          }
        )
        .catch(error =>{
          console.log(error);
        });
      }
    })
    .catch(error =>{
      console.log(error);
    });
  }
  
  openProduct(item:any){
    let manufacturer:any = {};
    manufacturer.image_manufacturer = item.img;
    manufacturer.m_name = item.name_product;
    manufacturer.m_id = item.id_manufacturer;
    
    this.searchService.search( item.id_manufacturer, '2' ).then((data:any) => {
      if(data.total == 1){
        let productFather:any = data.result['0'];
        this.navCtrl.push(ProductChildPage,{
          manufacturer: manufacturer,
          productFather: productFather
        });
      }
      else {
        this.navCtrl.push(ProductFatherPage,{
          manufacturer: manufacturer
        });        
      }
    })
    .catch(error =>{
      console.log(error);
    });
  }
  
  openCustomerId(item:any){
    let data = item;
    data.id = item.id_customer;
    setTimeout(()=>{ this.openCustomer(data); }, 100);
  }
  
  openCustomer(item:any){
    let messageModal = this.modalCtrl.create( ProfileModalPage, { customer: item } );
    messageModal.onDidDismiss(data => {
      if(data){
        this.openCustomer(data.send);
      }
    });
    messageModal.present();
  }
  
  // Busqueda en la Red
  filterItems(searchTerm){
    return this.networkG.filter((item) => {
      return item.username.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
  
  setFilteredItems() {
    if(this.searchTermFluzzer !== ''){
      this.filterFluzzers = this.filterItems(this.searchTermFluzzer);
      this.filterFluzzers = (this.filterFluzzers.length == 0) ? false : this.filterFluzzers;
    }
    else {
      this.filterFluzzers = null;
    }
//    this.filterFluzzers = (this.searchTermFluzzer !== '')?this.filterItems(this.searchTermFluzzer): null;
  }
 
 
  
  // Graphic Start
  getNetworkGUsers(){
    this.storage.get('userData').then((val) => {
      this.network.getNetworkGUser(val.id).then(
        (data:any) => {
          this.networkG = data.result;
          setTimeout(()=>{ 
            if(Object.keys(this.networkG).length > 0){
              this.defineMaxRadius();
            }
          }, 100 );
        }
      )
      .catch(error =>{
        console.log(error);
      });
    })
    .catch(error =>{
      console.log(error);
    });
  }
  
  defineMaxRadius(){
    this.lastItem = this.networkG[Object.keys(this.networkG).length-1];
    for(var i=1; i < this.lastItem.level + 1; i++){
      this.MaxRadius = this.MaxRadius + this.MinRadius - 2 * i;
    }
    setTimeout(()=>{ this.defineSizeCanvas() }, 100 );
  }
  
  defineSizeCanvas(){
    this.CanvasWidth = ( this.CanvasWidth > (this.MaxRadius*2) + 100 ) ? this.CanvasWidth : (this.MaxRadius*2) + 100;
    this.CanvasHeight = ( this.CanvasHeight > (this.MaxRadius*2) + 100 ) ? this.CanvasHeight : (this.MaxRadius*2) + 100;
    setTimeout(()=>{ this.defineCenterCanvas() }, 100 );
  }
  
  defineCenterCanvas(){
    this.CanvasCenter.x = ( this.CanvasCenter.x > ( this.CanvasWidth/2 ) ) ? this.CanvasCenter.x : ( this.CanvasWidth/2 ); 
    this.CanvasCenter.y = ( this.CanvasCenter.y > ( this.CanvasHeight/2 ) ) ? this.CanvasCenter.y : ( this.CanvasHeight/2 ); 
    setTimeout(()=>{ this.startDrawCanvas() }, 100 );
  }
  
  startDrawCanvas(){
    let ctx : CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');
    ctx.canvas.width = this.CanvasWidth;
    ctx.canvas.height = this.CanvasHeight;
    setTimeout(()=>{ this.drawNetworkG(ctx) }, 100 );
  }
  
  drawNetworkG(ctx:CanvasRenderingContext2D){
    let radiusImage = 18;
    this.drawImage(ctx, radiusImage, this.CanvasCenter.x, this.CanvasCenter.y, this.userData.image);
    let countPerson:any;
    for( var i = 1; i <= this.lastItem.level; i++){
      countPerson = 0;
      radiusImage = (radiusImage <= 4) ? 4 : radiusImage - 2;
      this.radius = this.radius + this.MinRadius - 2*i;
      this.drawRadius(ctx, this.radius);
      let points:number = this.countPointsByLevel(i);
      let angulo:number = 360 / points;
      
      for( var j=0; j < Object.keys(this.networkG).length ; j++ ){
        if(this.networkG[j].level == i){
          this.networkG[j].coordenades = this.calculatePoint(this.radius, angulo*j);
          this.networkG[j].radiusImage = radiusImage;
          this.networkG[j].radius = this.radius;
          this.drawImage(ctx, radiusImage, this.networkG[j].coordenades.x, this.networkG[j].coordenades.y, this.networkG[j].img)
        }
      }
    }
  }
  
  countPointsByLevel(level:any){
    let countPerson = 0;
    for( var j=0; j < Object.keys(this.networkG).length ; j++ ){
      countPerson = ( this.networkG[j].level == level ) ? countPerson + 1 : countPerson;
    }
    return countPerson;
  }
  
  calculatePoint(radio:number, pointAngle:number){
    let result;
    result = Object.assign(
      { 
        x: ((radio * (Math.round((Math.cos( pointAngle * Math.PI / 180))*1000)/1000))+this.CanvasCenter.x),
        y: ((radio * (Math.round((Math.sin( pointAngle * Math.PI / 180))*1000)/1000))+this.CanvasCenter.y)
      }
    );
    return result;
  }
  
  drawImage(ctx:CanvasRenderingContext2D, radius:any, x:any, y:any, imgProfile:any) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "#FFF";
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = radius * 0.5;
    ctx.stroke();
    ctx.clip();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    if(imgProfile == false){
      let quadrant = this.calculateQuadrantForImage(x, y);
      ctx.drawImage(this.img[quadrant], 0, 0, this.img[quadrant].width, this.img[quadrant].height, x - radius, y - radius, radius*2, radius*2);
    }
    else {
      let image = new Image();
      image.src = imgProfile;
      image.onload = function(){
        ctx.drawImage(image, 0, 0, image.width, image.height, x - radius, y - radius, radius*2, radius*2);
      }
    }
    ctx.restore();
  }
    
  calculateQuadrantForImage(x:any, y:any){
    return (x == this.CanvasCenter.x && y == this.CanvasCenter.y) ? 0 : (x > this.CanvasCenter.x) ? ((y > this.CanvasCenter.y) ? 1 : 4) : ((y > this.CanvasCenter.y) ? 2 : 3);
  }  
  
  drawRadius(ctx:CanvasRenderingContext2D, radius:number){
    ctx.beginPath();
    ctx.arc(this.CanvasCenter.x, this.CanvasCenter.y, radius, 0, Math.PI*2, false);
    ctx.strokeStyle = '#828282';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  
  clickCricle(ev:any){
    let distanceMin = 10;
    let distance;
    let point:any = false;
    if(Math.sqrt( ((ev.layerX-this.CanvasCenter.x)*(ev.layerX-this.CanvasCenter.x))+((ev.layerY-this.CanvasCenter.y)*(ev.layerY-this.CanvasCenter.y)) ) < distanceMin){
      this.navCtrl.push(MorePage);
    }
    else {
      for (var i=0; i < Object.keys(this.networkG).length ; i++){
        distance = Math.sqrt( ((ev.layerX-this.networkG[i].coordenades.x)*(ev.layerX-this.networkG[i].coordenades.x))+((ev.layerY-this.networkG[i].coordenades.y)*(ev.layerY-this.networkG[i].coordenades.y)) );
        if( distanceMin > distance ){
          distanceMin = distance;
          point = this.networkG[i];
        }
        if(i == Object.keys(this.networkG).length-1 && point != false){
          this.openCustomerGId(point);
        }
      }
    }
  }
  
  openCustomerGId(item:any){
    let data = item;
    setTimeout(()=>{ this.openCustomer(data); }, 100);
  }
  // Graphic End
  
}
