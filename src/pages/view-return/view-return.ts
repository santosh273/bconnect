import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http, RequestOptions,Headers } from '@angular/http';
import * as Enums from '../../models/interfaces/enums';
import { InAppBrowserOptions, InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeStorage } from '@ionic-native/native-storage';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';


/**
 * Generated class for the ViewReturnPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-return',
  templateUrl: 'view-return.html',
})
export class ViewReturnPage {
  userIdx: any;
  details:any;
  products:any;
  idx:any;

  constructor(public navCtrl: NavController,private nativeStorage: NativeStorage, public navParams: NavParams, private iab: InAppBrowser,private http: HttpInterceptor,public alertCtrl: AlertController,public loadingCtrl:LoadingController) {
    this.idx = navParams.get('IDX');
    this.getdetails(this.idx)
    this.getProductDetails(this.idx);
    this.nativeStorage.getItem('userID')
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.userIdx = data;
      console.log("User Id:" + this.userIdx);
      this.updateNotification(this.userIdx,this.idx);
      // this.getPending(this.userId);
    },
    error => console.error(error)
    );

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewReturnPage');
  }

  getdetails(idx:string){
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
    this.http.get(Enums.APIURL.URL+'/fetchsalesreturndetailsbyidx/'+idx).map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      this.details = obj; 
      console.log(this.details)
        //  this.orderNo= payment[0].orderNo;
          console.log(this.details[0].InvoiceNo);
          loader.dismiss();
        },err => {
          console.log(err);
          loader.dismiss();
        });/////end details

  }
  getProductDetails(idx:string){
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
    this.http.get(Enums.APIURL.URL+'/fetchsalesreturnproductdetailsbyidx/'+idx).map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      this.products = obj; 
      console.log(this.products)
        //  this.orderNo= payment[0].orderNo;
          console.log(this.products[0].productName);
          loader.dismiss();
        },err => {
          console.log(err);
          loader.dismiss();
        });/////end products

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
  Viewfile(urlText: string) {
    let target = "_system";
    var urlapp = Enums.APIURL.WEB_APP_URL+'FilesFolder/';
    this.iab.create(urlapp + urlText,'_blank','location=no,toobar=no');
  
  
  }

  updateNotification(userId,idx){
    console.log(userId,idx);
    var name ="Sales Return";
    let headers1 = new Headers(
      {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      });
   
 
      let options = new RequestOptions({ headers: headers1 });
      
   
     
      // this.loading.present();
      return new Promise((resolve, reject) => {
        this.http.post(Enums.APIURL.URL+'fetchnotificationupdateidx/'+userId+'/'+name+'/'+idx, options)
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

}
