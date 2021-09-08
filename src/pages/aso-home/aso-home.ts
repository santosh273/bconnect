import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController, AlertController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { SignInPage } from '../sign-in/sign-in';
import { Headers,RequestOptions } from '@angular/http';
import * as Enums from '../../models/interfaces/enums';
import {Observable,Subscription} from 'rxjs/Rx';
import { CustAlert } from '../../providers/cust-alert/cust-alert';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import { InfoPage } from '../info/info';
import { SchemePage } from '../scheme/scheme';
import { Badge } from '@ionic-native/badge';

/**
 * Generated class for the AsoHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aso-home',
  templateUrl: 'aso-home.html',
})
export class AsoHomePage {

  SalesOrderSummary : string;
  SalesReturnSummary : string;
  ShowSalesOrderSummary = false;
  ShowSalesReturnSummary = false;

  alertt;
  passwordStatus: any;
  passwordPolicy: any;
  userinfo: any;
  showcustomerEngagementGraph: boolean
  customerEngagement: any;
  showCreditGrph: boolean;
  creditLimitGraph: string;
  showCreditLimit: boolean;
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
  usertype: any;
  url1: string;
  regCust: boolean;
  custList: boolean;
  showScheme: boolean;
  showSales: boolean;
  roles: any;
  code: any;
  name: any;
  user: any;
  showSpineer: boolean=false;
  unRead:any;
  notifiy:number=0;
  EMPIDX:any;
  showGraph=false;
  showSaleDiv=true;
  salesProgression:any;;
  observableVar: Subscription;
  constructor(public modalCtrl: ModalController,private alertCtrl: AlertController,public badge:Badge,public navCtrl: NavController, public navParams: NavParams,public menu: MenuController,private nativeStorage: NativeStorage,private http: HttpInterceptor, private custAlert:CustAlert) {
    this.checkPasswordUpdates();
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
    setTimeout(() => {
      this.hideLoader=true;
      console.log("hideLoader");
    }, 1000);
   
  }
  onLoadT(): void { 
    setTimeout(() => {
      this.hideTarget=true
      console.log("hideTarget");
    }, 1000);
   
  }
  onLoadB(): void {
    setTimeout(() => {
      this.hideBar=true
      console.log("hideBar");
    }, 1000);
  
  }
  onLoadF(): void {
   setTimeout(() => {
    this.hideFocus=true
    console.log("hideFocus");
   }, 1000); 
    
  }

  ionViewDidLoad() {
  
    this.nativeStorage.getItem('profile')//EmpIDX2
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.user = data;
      this.name=this.user[0].firstName +" "+this.user[0].lastName;
      this.code=this.user[0].employeeCode;
       console.log("userName:" + this.user[0].firstName + this.user[0].lastName);
       this.usertype=this.user[0].userTypeIdx;
    },
    error => console.error(error)
    );
  
    this.requestPermission(); 
    //  this.menu.enable(false);
    console.log('ionViewDidLoad AsoHomePage');
    this.nativeStorage.getItem('roles')//loading role wise functionality....
    .then(
    data => {
      console.log("roles---" + data);
        var roles = data;
      for(let rol of roles){
        // debugger

        console.log(" role name ="+rol.Name);
        if(rol.Name=="Administrations-CustomerRegistration"){
          this.regCust=true;
        }

        else if(rol.Name=='Administrations-Customerlist'){
          this.custList=true;
        }else if(rol.Name=='Customer- Sales Order (View Requests)-SO'){
          this.showSales=true;
        }else if(rol.Name=='Scheme'){
          this.showScheme=true;
        }else if(rol.Name=="SalesProgression"){
          this.showSalesProgression=true;
        } else if (rol.Name == 'MonthlySales') {
          this.showBarGraph = true;
        } else if (rol.Name == 'FocusBrand') {
          this.showFocusBrand = true;
        } else if (rol.Name == "TargetVsSales") {
          this.showtargetvsprogress = true;
        }else if (rol.Name == "CreditLimit") {
          this.showCreditLimit = true;
        }else if(rol.Name == 'CreditLimitGraph'){
          this.showCreditGrph = true;
          console.log(this.showCreditGrph);
        }else if(rol.Name == 'showcustomerEngagementGraph'){
          this.showcustomerEngagementGraph = true;
          console.log(this.showcustomerEngagementGraph);
        }                   
        else if(rol.Name== 'SalesOrderSummary'){
          this.ShowSalesOrderSummary= true;
          console.log(this.ShowSalesOrderSummary);
        }
        else if(rol.Name== 'SalesReturnSummary'){
          this.ShowSalesReturnSummary=true;
          console.log(this.ShowSalesReturnSummary);
        }
  


      }
      
    },
    error => console.error(error)
    );
  }
  checkPasswordUpdates(){
     // alert("function working");
    this.nativeStorage.getItem('profile')//userid
  .then(
  data => {
    console.log("URID from page dashoard" + data);
    this.userinfo = data;

    // alert(JSON.stringify(data))

    console.log("User Id:" + this.userinfo[0]);
    console.log("Idx:" + this.userinfo[0]. idx);
    var idx=this.userinfo[0].idx;

   this.getPassStatus(idx).then((x=>{
     if(x){
      // alert("function working --- x");
     }else{
      this.presentPrompt();
      // alert("function working --- x");
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
            // alert("function working --- obj");
            resolve(true);
          }else{
            resolve(false);
            // alert("function working --- objelse");
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
    this.alertt = this.alertCtrl.create({
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
          placeholder: 'Please Confrim Password',
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
 
  ionViewDidEnter(){
    this.menu.enable(false);
    this.menu.swipeEnable(false);
    this.notifiy=0;
    this.nativeStorage.getItem('EmpIDX2')//userid
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.EMPIDX = data;
      console.log("EMPIDX Id:" + this.EMPIDX);
      this.getAllNotifcations(this.EMPIDX);
      this.barGraph=Enums.APIURL.WEB_APP_URL+"graphformobiles/graphs.aspx?graphs=1&year=2019&usertype="+this.usertype+"&empidx="+this.EMPIDX;
      this.salesProgression=Enums.APIURL.WEB_APP_URL+"graphformobiles/graphs.aspx?salesprogress=1&year=2019&usertype="+this.usertype+"&empidx="+this.EMPIDX;
      this.focusbrand=Enums.APIURL.WEB_APP_URL+"graphformobiles/graphs.aspx?focusbrand=1&year=2019&usertype="+this.usertype+"&empidx="+this.EMPIDX;
      this.targetvsprogress= Enums.APIURL.WEB_APP_URL+"graphformobiles/graphs.aspx?targetvsprogress=1&year=2019&usertype="+this.usertype+"&empidx="+this.EMPIDX;
      this.creditLimitGraph=  Enums.APIURL.WEB_APP_URL+"graphformobiles/graphs.aspx?creditlimit=1&empidx="+this.EMPIDX;
      this.customerEngagement=  Enums.APIURL.WEB_APP_URL+"GraphForMobiles/Graphs.aspx?cee=1&empidx="+this.EMPIDX;
      this.SalesOrderSummary =Enums.APIURL.WEB_APP_URL+"graphformobiles/graphs.aspx?salesordersummary=1&empidx="+this.EMPIDX;
      this.SalesReturnSummary =Enums.APIURL.WEB_APP_URL+"graphformobiles/graphs.aspx?salesreturnsummary=1&empidx="+this.EMPIDX;
    },
    error => console.error(error)
    );

    this.observableVar =  Observable.interval(2000 * 60).subscribe(x => {
      this.notifiy=0;
      this.getAllNotifcations(this.EMPIDX);
      console.log('intervel:getAllNotifcations');
    });
  
    console.log('ionViewDidEnter:notifiaction updated');
  }
  ionViewDidLeave(){
    this.observableVar.unsubscribe();
 }
  ionViewWillEnter() {
    
    this.menu.enable(false);
    let elements  = document.querySelectorAll('.tabbar');
    if ( elements  !== null ) {
      console.log("tabs");
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'none';
    });
      // Object.keys(tabs).map((key) => {
      //   tabs[ key ].style.transform = 'translateY(56px)';
      // });
    } // end if
  }


  notifyy(){
    if(this.notifiy === 0){
      this.custAlert.presentAlert("Empty","Sorry! You dont have any notification.");
    }else{
      //  this.updateNoti(this.EMPIDX);
       this.navCtrl.push('AsoNotificationListPage',{EMPIDX:this.EMPIDX});
     
    }
  }
  aso_SalesOrder(){
    
    this.navCtrl.push('AsoListPage');
    
   
  }
  logout(){
    this.nativeStorage.setItem('isloggedIn', false)
    .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
    );
    this.navCtrl.setRoot(SignInPage);
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
  getAllNotifcations(EMPIDX:any){
    this.showSpineer=true;
    this.http.get(Enums.APIURL.URL+'fetchASONotifcations/'+ EMPIDX).map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      // alert(obj[0].userName);
      console.log(obj);
         this.unRead = obj
         console.log(this.unRead);
         this.getAllUnread(this.unRead);
         this.showSpineer=false;
        //  this.loading.dismiss();
    
        },err => {
          console.log(err);
        });
        
  }

  getAllUnread(unRead){
    if(this.unRead[0] === undefined || this.unRead[0] === ""){
     this.notifiy=0;
     this.badge.clear();
    }
    else{
      for(var i =0;i<unRead.length;i++){
        this.notifiy = +unRead[i].unread+ +this.notifiy
        console.log(this.notifiy);
        this.setBadges(this.notifiy);
  
      }
  
    }
    
  }
  // updateNoti(userId){
  //   // console.log(this.imagebyte);
  //   // var url = "http://webapps.a2zcreatorz.com/Bayer/DIS.svc/SavePng";
  //   let headers1 = new Headers(
  //     {
  //       'Accept' : 'application/json',
  //       'Content-Type' : 'application/json'
  //     });
   
 
  //     let options = new RequestOptions({ headers: headers1 });
      
      
  
     
  //     return new Promise((resolve, reject) => {
  //       this.http.post(Enums.APIURL.URL+'updateASONotifications/'+ userId, options)
  //       .toPromise()
  //       .then((response) =>
  //       {
        
  //         console.log('API Response : ', response.json());
  //       //  this.showAlert("Bayer","Your feedback has been sent to Bayer.\n Thankyou.");
  //         // this.navCtrl.setRoot(HomePage);
  //        // this.navCtrl.push('AsoListPage');
  //         resolve(response.json());
  //       })
  //       .catch((error) =>
  //       {
  //         console.error('API Error : ', error.status);
  //         console.error('API Error : ', JSON.stringify(error));
  //         alert("Error");
  //         reject(error.json());
  //       });
  //     });
  // }

  InfoModel(){
    let profileModal = this.modalCtrl.create(InfoPage);
    profileModal.present();
}
scheme(){
  this.navCtrl.push(SchemePage,{userType:'aso'});
}
profile(){
  this.navCtrl.push("ViewProfilePage");
}
regCustomer(){
  this.navCtrl.push("CustomerRegPage");
}

customerList(){
  this.navCtrl.push("StatusCRequestPage");
}
gift(){
  this.navCtrl.push("GiftsPage"); 
}
cridt(){
  this.navCtrl.push("CustomerCreditLimitPage")
}

giftsStatus(){
  this.navCtrl.push("GiftsStatusPage")
  
}
// CPBP() { 
//   this.navCtrl.push("ViewPlanePage")
// }

}
