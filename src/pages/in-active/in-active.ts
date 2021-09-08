import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Navbar } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

import * as Enums from '../../models/interfaces/enums';
import {Observable} from 'rxjs/Rx';
import { CustAlert } from '../../providers/cust-alert/cust-alert';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';



/**
 * Generated class for the InActivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-in-active',
  templateUrl: 'in-active.html',
})
export class InActivePage {
  urlapp: string;
  @ViewChild(Navbar) navBar: Navbar;
  schemes:any;
  userId:any;
  loading:any;
  nodata = false;
  userType:any;
  constructor(public navCtrl: NavController, private iab: InAppBrowser,public loadingCtrl: LoadingController, public navParams: NavParams,private nativeStorage: NativeStorage,private http: HttpInterceptor) {
  //  this.userType = this.navParams.get('userType');
   this.nativeStorage.getItem('isloggedIn')
      .then(
      data => {
        console.log("URID from page dashoard" + data);
        this.userType = data;
        console.log("User Id:" + this.userId);
        this.myMethod(this.userType);
       
      },
      error => console.error(error)
      );
   

    ///
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: `
        
        <div>Loading...</div>`,
     
    });
    // import {Observable} from 'rxjs/Rx';
    Observable.interval(2000 * 60).subscribe(x => {
      this.getSchemes(this.userId);
      console.log('intervel:getSchemes');
    });
  }
  myMethod(type){
    if(this.userType==3){
      this.nativeStorage.getItem('EmpIDX2')
      .then(
      data => {
        console.log("URID from page dashoard" + data);
        this.userId = data;
        console.log("User Id:" + this.userId);
        
        this.getSchemesAso(this.userId);
      },
      error => console.error(error)
      );
    
     }else{
      this.nativeStorage.getItem('userID')
      .then(
      data => {
        console.log("URID from page dashoard" + data);
        this.userId = data;
        console.log("User Id:" + this.userId);
        
        this.getSchemes(this.userId);
      },
      error => console.error(error)
      );
    
     }
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e: UIEvent) => {
      console.log("Back button clicked");
      this.navCtrl.parent.viewCtrl.dismiss();
    };
    console.log('ionViewDidLoad InActivePage');
  }

  getSchemes(userId:any){//0 for inactice& 1 for active scheme
    this.loading.present();
    this.http.get(Enums.APIURL.URL+'fetchschemelist/'+userId+'/0').map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      // alert(obj[0].userName);
         this.schemes = obj; 
         console.log(this.schemes);
         this.loading.dismiss();
         console.log(this.schemes);
         console.log(this.schemes[0]);
         if(this.schemes[0] === undefined){
          //  alert("No schemes found...");
          this.nodata=true;

         }else{
           this.nodata=false;
         }
        //  console.log;
    
        });
  }

  ///Aso///
  getSchemesAso(userId:any){//0 for inactice& 1 for active scheme
    this.loading.present();
    this.http.get(Enums.APIURL.URL+'fetchschemelistemp/'+userId+'/0').map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      // alert(obj[0].userName);
         this.schemes = obj; 
         console.log(this.schemes);
         this.loading.dismiss();
         console.log(this.schemes);
         console.log(this.schemes[0]);
         if(this.schemes[0] === undefined){
          //  alert("No schemes found...");
          this.nodata=true;

         }else{
           this.nodata=false;
         }
        //  console.log;
    
        });
  }

  // title:string,sDate:string,eDate:string,attachement:string,des:string
   viewScheme(scheme:any){
     console.log(scheme);
     this.navCtrl.push('SchemeDetailsPage',{Scheme:scheme});
     
   }
   ionViewWillUnload() {
    this.loading.dismiss();
    console.log('ionViewWillUnload');
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
};

Viewfile(urlText: string) {
  let target = "_system";
  this.urlapp = Enums.APIURL.WEB_APP_URL+'FilesFolder/';
  this.iab.create(this.urlapp + urlText,target,'location=no,toobar=no');


}

}
