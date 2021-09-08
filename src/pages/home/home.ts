import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, MenuController, ModalController, Events } from 'ionic-angular';
import {usercreds} from '../../models/interfaces/usercreds'
import { SalesPage } from '../sales/sales';
import { NativeStorage } from '@ionic-native/native-storage';
import { SchemePage } from '../scheme/scheme';
import { Http, RequestOptions,Headers } from '@angular/http';
import * as Enums from '../../models/interfaces/enums';
import {Observable,Subscription} from 'rxjs/Rx';
import { CustAlert } from '../../providers/cust-alert/cust-alert';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import { InfoPage } from '../info/info';
import { Badge } from '@ionic-native/badge';
// import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  showLoyalityPoints: boolean;
  loylityGraph: string;
  showCreditGrph: boolean;
  Showdemandgraph: boolean;
  demandGraphBar: string;
  creditLimitGraph: string;
  demandgraph: string;
  showGraph=false;
  showSaleDiv=true;
  salesProgression:any;;
  showtargetvsprogress: boolean;
  showFocusBrand: boolean;
  showBarGraph: boolean;
  showSalesProgression: boolean;
  targetvsprogress: string;
  focusbrand: string;
  barGraph: string;
  hideLoader: boolean=false;
  hideBar: boolean=false;
  hideFocus: boolean=false;
  hideTarget: boolean=false;
  showScheme: boolean;
  showDocs: boolean;
  showcheme: boolean;
  showSales: boolean;
  showReturn: boolean;



  roles: any;
  code: any;
  name: string;
  user: any;
  alertt: any;;
  userName:any;
  userId:any;
  loading:any;
  credentials ={} as usercreds;
  unRead:any;
  notifiy:number=0;
  userinfo:any;
  passwordStatus:boolean=false;
  passwordPolicy:any;
  showSpineer=false;
  observableVar: Subscription;
//  tabBarElement:any;
  constructor(public events: Events,public badge:Badge,public modalCtrl: ModalController,public navCtrl: NavController,public menu: MenuController,public alert:AlertController,private custAlert:CustAlert,public navParams: NavParams,private nativeStorage: NativeStorage,public loadingCtrl: LoadingController,private http: HttpInterceptor) {
    
    this.nativeStorage.getItem('roles')//loading role wise functionality....
    .then(
    data => {
      console.log("roles" + data);
        var roles = data;
        this.events.publish('user:roles',roles);
      for(let rol of roles){
        if(rol.name=='Customer- SalesReturn (Make a Request)-SR'){
          this.showReturn=true;
        }
        else if(rol.name=='Customer- SalesReturn (Make a Request)-SR'){
          this.showReturn=true;
        }else if(rol.name=='Customer- Sales Order (View Requests)-SO'){
          this.showSales=true;
        }else if(rol.name=='rCustomer- Schemes'){
          this.showScheme=true;
        }else if(rol.name=='Customer-MyDocs'){
          this.showDocs=true;
        }
        

      }
      
    },
    error => console.error(error)
    );

   
    this.userName = navParams.get("userName"); 
    this.checkPasswordUpdates();
    this.observableVar = Observable.interval(2000 * 60).subscribe(x => {
      this.notifiy=0;
      this.getAllNotifcations(this.userId);
      console.log('intervel:getAllNotifcations');
    });
    this.requestPermission();

    
    this.nativeStorage.getItem('profile')//EmpIDX2
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.user = data;
      this.name=this.user[0].customerName;
      this.code=this.user[0].customerNo;
      // this.name=this.user[0].firstName +" "+this.user[0].lastName
       console.log("userName:" + this.user[0].firstName + this.user[0].lastName);
      
    },
    error => console.error(error)
    );
  }
  ionViewDidLeave(){
    this.observableVar.unsubscribe();
 }
  activeNext(show){
    if(show=='div'){
      this.hideLoader=false;
      this.hideTarget=false
      this.hideBar=false
      this.hideFocus=false

      this.showGraph=false;
      this.showSaleDiv=true;
    }else if(show=='grph'){
      this.showGraph=true;
      this.showSaleDiv=false;
    }
  }
  onLoadL(): void {
    // setTimeout(() => {
      this.hideLoader=true;
      console.log("hideLoader");
    // }, 1000);
   
  }
  onLoadT(): void { 
    // setTimeout(() => {
      this.hideTarget=true
      console.log("hideTarget");
    // }, 1000);
   
  }
  onLoadB(): void {
    // setTimeout(() => {
      this.hideBar=true
      console.log("hideBar");
    // }, 1000);
  
  }
  onLoadF(): void {
  //  setTimeout(() => {
    this.hideFocus=true
    console.log("hideFocus");
  //  }, 1000); 
    
  }

  ionViewDidLoad() {
    // let elem = <HTMLElement>document.querySelector(".tabbar");
    // if (elem != null) {
    //   elem.style.display = 'none';
    // }
    console.log('ionViewDidLoad homePage');
    this.nativeStorage.getItem('roles')//loading role wise functionality....
    .then(
    data => {
      console.log("roles" + data);
        var roles = data;
      for(let rol of roles){
        if(rol.name=='Customer- SalesReturn (Make a Request)-SR'){
          this.showReturn=true;
        }
        else if(rol.name=='Customer- SalesReturn (Make a Request)-SR'){
          this.showReturn=true;
        }else if(rol.name=='Customer- Sales Order (View Requests)-SO'){
          this.showSales=true;
        }else if(rol.name=='Customer- Schemes'){
          this.showScheme=true;
        }else if(rol.name=='Customer-MyDocs'){
          this.showDocs=true;
        }else if(rol.name=='TargetVsSales'){
          this.showtargetvsprogress=true;
        }else if(rol.name=='MonthlySales'){
          this.showBarGraph=true;
        }else if(rol.name=='DemandGeneration'){
          this.Showdemandgraph=true;
        }
        else if(rol.name=='CreditLimitGraph'){
          this.showCreditGrph=true;
        }
        else if(rol.name=='FocusBrand'){
          this.showFocusBrand=true;
        }else if(rol.name=='SalesProgression'){
          this.showSalesProgression=true;
        }
        // else if(rol.name=='loyaltyPointGraph'){
        //   this.showLoyalityPoints=true;
        // }


      }
      
    },
    error => console.error(error)
    );

    this.nativeStorage.getItem('reward')//loading role wise functionality....
    .then(
    data => {
      console.log("reward dash" + data);
        var rewards = data;
        this.events.publish('user:reward',rewards);
     if(rewards === 1 || rewards === '1')
     {
      this.showLoyalityPoints=true;

     }
     
        // else if(rol.name=='loyaltyPointGraph'){
        //   this.showLoyalityPoints=true;
        // }

    },
    error => console.error(error)
    );
  }
  // ionViewDidEnter(){
  //   this.loading.dismiss();
  //   console.log('ionViewDidEnter homePage');
  // }
  ionViewDidEnter(){
    this.menu.enable(true);
    this.menu.swipeEnable(true);
    this.notifiy=0;
    this.nativeStorage.getItem('userID')//userid
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.userId = data;
      this.getAllNotifcations(this.userId);
      console.log("User Id:" + this.userId);
      this.barGraph=Enums.APIURL.WEB_APP_URL+"graphformobiles/graphs.aspx?graphs=1&year=2019&usertype=4&CustomerIdx="+this.userId;
      this.salesProgression=Enums.APIURL.WEB_APP_URL+"graphformobiles/graphs.aspx?salesprogress=1&year=2019&usertype=4&CustomerIdx="+this.userId;
      this.focusbrand=Enums.APIURL.WEB_APP_URL+"graphformobiles/graphs.aspx?focusbrand=1&year=2019&usertype=4&CustomerIdx="+this.userId;
      this.targetvsprogress= Enums.APIURL.WEB_APP_URL+"/graphformobiles/graphs.aspx?targetvsprogress=1&year=2019&usertype=4&CustomerIdx="+this.userId;
      this.demandgraph=Enums.APIURL.WEB_APP_URL+"graphformobiles/graphs.aspx?demandgraphvalues=1&usertypeidx=4&dealerIdx="+this.code
      this.creditLimitGraph= Enums.APIURL.WEB_APP_URL+"graphformobiles/graphs.aspx?creditlimit=1&customerno="+this.code;
      this.demandGraphBar=Enums.APIURL.WEB_APP_URL+"graphformobiles/graphs.aspx?degraph=1&dealeridx="+this.code
      this.loylityGraph=Enums.APIURL.WEB_APP_URL+"graphformobiles/graphs.aspx?loyaltypoints=1&customerno="+this.code
                                                                                                                                                           
    
    }
    );
    console.log('ionViewDidEnter:notifiaction updated');

     // import {Observable} from 'rxjs/Rx';
    
  }
  ionViewWillEnter() {
   
    let elements  = document.querySelectorAll('.tabbar');
    if ( elements  !== null ) {
      console.log("tabs");
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'none';
    });
     
    } // end if

    
  }
 
  async requestPermission() {
    try {
      let hasPermission = await this.badge.hasPermission();
      console.log(hasPermission);
      if (!hasPermission) {
        let permission = await this.badge.requestPermission();
        console.log(permission);
      }
    } catch (e) {
      console.error(e);
    }
  }
  async setBadges(badgeNumber: number) {
    try {
      let badges = await this.badge.set(badgeNumber);
      console.log(badges);
    } catch (e) {
      console.error(e);
    }
  }
  getAllNotifcations(userId:any){
    this.showSpineer=true;
    this.http.get(Enums.APIURL.URL+'fetchnotificationgroupbyidx/'+ userId).map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      // alert(obj[0].userName);
         this.unRead = obj; 
         console.log(this.unRead);
         this.getAllUnread(this.unRead);
         this.showSpineer=false;
        //  this.loading.dismiss();
    
        });
        
  }

  getAllUnread(unRead){
    if(this.unRead[0] === undefined || this.unRead[0] === ""){
     this.notifiy=0;
     this.badge.clear();

    }
    else{
      for(var i =0;i<unRead.length;i++){
        this.notifiy = +unRead[i].UnRead+ +this.notifiy;
        console.log(unRead[i].UnRead);
        console.log(this.notifiy);
        this.setBadges(this.notifiy);
  
      }
  
    }
    
  }
  salesorder(){
    this.nativeStorage.setItem('salesType', 'order')
    .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
    );
    //end
    this.navCtrl.push(SalesPage,{userID:this.userId});
  }
  salesreturn(){
     this.nativeStorage.setItem('salesType', 'return')
    .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
    );
    //end
    this.navCtrl.push(SalesPage);
  }
  scheme(){
    this.navCtrl.push(SchemePage);
  }

  complains(){
    this.navCtrl.push('MyDocPage');

  }
  gotoNotificaton(){
    if(this.notifiy === 0){
      this.custAlert.presentAlert('Empty','You dont have any notification to show.');
    }else{
      this.navCtrl.push('NotificationsPage');
    }
    
  }

    checkPasswordUpdates(){
     
      this.nativeStorage.getItem('profile')//userid
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.userinfo = data;
      console.log("User Id:" + this.userinfo[0]);
      console.log("Idx:" + this.userinfo[0]. idx);
      var idx=this.userinfo[0].idx;

     this.getPassStatus(idx).then((x=>{
       if(x){
        
       }else{
        this.presentPrompt();
       }
     }))
     
     
    },
    error => console.error(error)
    );

    }

   

    getPassStatus(idx){
      return new Promise((resolve=>{
        this.http.get(Enums.APIURL.URL+'fetchcheckpaswordexpairy/'+ idx).map(res => res.json()).subscribe(data => {
          // debugger;
           var obj = JSON.parse(data);
          // alert(obj[0].userName);
            this.passwordStatus=obj;
            console.log("passStatus",obj)
            //  this.loading.dismiss();
            if(obj === 0||obj ==="0"){
              console.log('status: 0',obj);
              resolve(true);
            }else{
              resolve(false);
           //   this.presentPrompt();
            }

            },err => {
              console.log(err);
              // resolve(false);
              // alert(err);
            });
            /////////

            this.http.get(Enums.APIURL.URL+'setPasswordPolicy').map(res => res.json()).subscribe(data => {
              // debugger;
               var obj = JSON.parse(data);
              // alert(obj[0].userName);
                this.passwordPolicy=obj[0].RegularExp;
                console.log("passPolicy",this.passwordPolicy)
                //  this.loading.dismiss();
            // resolve(true);
                },err => {
                  console.log(err);
                  // resolve(false);
                  // alert(err);
                });




      }));
     
    
    }
    presentPrompt() {
      this.alertt = this.alert.create({
        enableBackdropDismiss: false,
        title: 'Password Expired',
        inputs: [
          {
            name: 'password',
            placeholder: 'Password',
            type: 'password'
          },
          {
            name: 'cpassword',
            placeholder: 'Confrim Password',
            type: 'password',
            
          }
        ],
        buttons: [
          // {
          //   text: 'Cancel',
          //   role: 'cancel',
            
          //   handler: data => {
          //     console.log('Cancel clicked');
          //   }
          // },
          {
            text: 'Change',
            handler: data => {
              if (this.isValid(data.password, data.cpassword)) {
                this.alertt.dismiss();
                // logged in!
              } else {
                // invalid login
                return false;
              }
            }
          }
        ]
      });
      this.alertt.present();
    }

 public isValid(pass,cpass){
   console.log(pass,"___",cpass)

      if(pass === cpass){
        var regexx  = this.passwordPolicy;
        var str =  regexx.toString();

        var parts = /\/(.*)\/(.*)/.exec(str);
      var restoredRegex = new RegExp(parts[1], parts[2]);

     
        // console.log(this.passwordPolicy);

        if(restoredRegex.test(pass)){
          var idx=this.userinfo[0].idx;
          this.chekpassnotExists(idx,pass).then((x=>{
            if(x){
              this.custAlert.presentAlert('Success','Password changed successfully.');
              this.alertt.dismiss();
              return true;
              
            }else{
              return false;
            }
          }));
         
        }else{
          this.custAlert.presentAlert('Bad Password','Password must contains special characters and not be less than 8 characters.');
          return false;
         
        }
       
        
      }else{
        this.custAlert.presentAlert('Wrong Password','Password not matched with confrim Password field.');
         
        return false;
      }

    }


    chekpassnotExists(idx,pass){
      return new Promise((resolv=>{
          // Enums.APIURL.URL+'fetchmatchlasttenpasword/'+idx+'/'+pass
     this.http.get( Enums.APIURL.URL+'fetchmatchlasttenpasword/'+idx+'/'+pass).map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      // alert(obj[0].userName);
      console.log(obj);
        if(obj  || obj === "true"){
          this.custAlert.presentAlert('Bad Password','Password is from your last ten paswords please try another one.');
        }else{
          this.postnewPass(idx,pass).then((x=>{
            if(x){
                resolv(true);
            }else{
              resolv(false);
            }
          }));
         
        }
        //  this.loading.dismiss();
    // resolve(true);
        },err => {
          console.log(err);
          // resolve(false);
          // alert(err);
        });


      }));
   
    
    }
    postnewPass(idx,pass){
      return new Promise((res=>{

        let headers1 = new Headers(
          {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
          });
          
          
          let options = new RequestOptions({ headers: headers1 });
          
          
          
          
          return new Promise((resolve, reject) => {
            this.http.post(Enums.APIURL.URL+'postpassword/'+pass+'/'+idx, options)
            .toPromise()
            .then((response) =>
            {
              
              console.log('API Response : ', response.json());
              // this.loading.dismiss();
              // this.comment=null;
              // this.getComments(this.comp.Idx);
              
              
              resolve(response.json());
              if(response.json() ==="Success"){
                res(true);
              }else{
                res(false);
              }
             
            })
            .catch((error) =>
            {
              console.error('API Error : ', error.status);
              console.error('API Error : ', JSON.stringify(error));
              reject(error.json());
              res(false);
            });
          });
        }));
        }
        
        InfoModel(){
                    let profileModal = this.modalCtrl.create(InfoPage);
                    profileModal.present();
        }


        
      }
      
  
