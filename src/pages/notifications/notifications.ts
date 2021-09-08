import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Toast, ToastController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http, RequestOptions,Headers } from '@angular/http';
import * as Enums from '../../models/interfaces/enums';
import { SalesPage } from '../sales/sales';
import { SchemePage } from '../scheme/scheme';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import { InAppBrowserOptions, InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  nodataa: boolean;
  posts: any;
 
  urlapp: string;
  Notifications:any;
  userId:any;
  nodata:any;
  constructor(private toastCtrl: ToastController,private iab: InAppBrowser,public navCtrl: NavController, public navParams: NavParams,private nativeStorage: NativeStorage,public loadingCtrl: LoadingController,private http: HttpInterceptor) {
  
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

  ionViewDidEnter(){
    this.nativeStorage.getItem('userID')//userid
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.userId = data;
      console.log("User Id:" + this.userId);
      this.getAllNotifcations(this.userId);
     
    },
    error => console.error(error)
    );
    console.log('ionViewDidEnter:notifiaction updated');
  }

  getAllNotifcations(userId:any){

    let loader = this.loadingCtrl.create({
      content: "Please wait...",
     
    });
    loader.present();
  
    this.http.get(Enums.APIURL.URL+'fetchnotificationgroupbyidx/'+ userId).map(res => res.json()).subscribe(data => {
      console.log(Enums.APIURL.URL+'fetchnotificationgroupbyidx/'+ userId);
      // debugger;
       var obj = JSON.parse(data);
      // alert(obj[0].userName);
         this.Notifications = obj; 
         loader.dismiss();
          console.log(this.Notifications);
         if(this.Notifications[0] === undefined ){
          this.nodata = true;

        }
        else{
          this.nodata = false;
        }
    
        },err => {
          loader.dismiss();
          console.log(err);
        });
        
  }
  // getAllUnread(unRead){
  //   for(var i =0;i<unRead.length;i++){
  //     this.notifiy = +unRead[i].UnRead+ +this.notifiy
  //     console.log(this.notifiy);

  //   }

  // }

  gotoNoti(name,limit){
    console.log(name);
    if(name === "Sales Order"){
      this.nativeStorage.setItem('salesType', 'order')
    .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
    );
    //end
    // this.updateNotiication(this.userId,name);
    this.navCtrl.push('NotifcationListPage',{Name:"1",Lim:limit});
    }
    else if( name === "Sales Return"){
      this.nativeStorage.setItem('salesType', 'return')
      .then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
      );
      //end
      // this.updateNotiication(this.userId,name);
      this.navCtrl.push('NotifcationListPage',{Name:"2"});

    }

    else if(name ==="Complains"){
      // this.updateNotiication(this.userId,name);
      this.navCtrl.push('NotifcationListPage',{Name:"4"});
     
    }
    else if(name === "Schemes"){
      console.log(name);
      // this.updateNotiication(this.userId,name);
      this.navCtrl.push('NotifcationListPage',{Name:"3"});



    }
    else if(name === "Ledger Report"){

     this.getLedgerFileName(this.userId,"5");
    }
  }
  options : InAppBrowserOptions = {
    location : 'yes',//Or 'no' 
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only 
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only 
    toolbar : 'yes', //iOS only 
    enableViewportScale : 'no', //iOS only 
    allowInlineMediaPlayback : 'no',//iOS only 
    presentationstyle : 'pagesheet',//iOS only 
    fullscreen : 'yes',//Windows only   
    hideurlbar:'yes',
    footer:'no'
};
  Viewfile(urlText: string,idx) {
    let target = "_system";
    this.urlapp = Enums.APIURL.WEB_APP_URL+'MyDocs/';
    this.iab.create(this.urlapp + urlText,target,this.options);

    console.log(this.urlapp + urlText)
    setTimeout(() => {
      this.updateNotification(this.userId,idx);
      console.log('clear');
    }, 5000);
    

  }
  
 
  


  updateNotification(userId,idx){
    console.log(userId,idx);
   
    let headers1 = new Headers(
      {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      });
   
  
      let options = new RequestOptions({ headers: headers1 });
      
   
     
     
      return new Promise((resolve, reject) => {
        this.http.post(Enums.APIURL.URL+'fetchnotificationupdateidx/'+userId+'/Ledger Report/'+idx, options)
        .toPromise()
        .then((response) =>
        {
        
          console.log('API Response : ', response.json());
          // this.loading.dismiss();
          // this.comment=null;
          // this.getComments(this.comp.Idx);
          
          
          resolve(response.json());
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
  
  }

  getLedgerFileName(userId:any,name:any){
    return new Promise((resolve=>{
      let loadingg = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: `
          
          <div>Loading...</div>`,
       
      });
      loadingg.present();
      this.http.get(Enums.APIURL.URL+'fetchpendingnotifications/'+userId+'/'+name).map(res => res.json()).subscribe(data => {
        // debugger;
         var obj = JSON.parse(data);
        // alert(obj[0].userName);
           this.posts = obj; 
           console.log(this.posts);
           resolve(true);
           if(this.posts[0] === undefined){
            let toast = this.toastCtrl.create({
              message: 'Sorry no report found.You can check your reports in My Documents.',
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
          }
          else{
            console.log('FileName',this.posts[0].filename);
            this.Viewfile(this.posts[0].filename,this.posts[0].idx);
           
          }
           loadingg.dismiss();
      
          },err => {
            console.log(err);
           loadingg.dismiss();
          });
    }));
  }

}
