import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http } from '@angular/http';
import * as Enums from '../../models/interfaces/enums'
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { LoadingController } from 'ionic-angular';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
/**
 * Generated class for the MyDocPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-doc',
  templateUrl: 'my-doc.html',
})
export class MyDocPage {

  public imgURL=Enums.APIURL.WEB_APP_URL+"mydocs/"
  urlapp: string;
  posts: any;
  userinfo: any;
  nodata=false;
  constructor(public navCtrl: NavController, private iab: InAppBrowser, public navParams: NavParams,public http:HttpInterceptor,public nativeStorage:NativeStorage,public loadingCtrl: LoadingController) {

    this.nativeStorage.getItem('profile')//userid
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.userinfo = data;
      console.log("User Id:" + this.userinfo[0]);
      console.log("Idx:" + this.userinfo[0].customerNo);
      var custumerNO=this.userinfo[0].customerNo;
      this.getMydoc(custumerNO); 
    },
    error => console.error(error)
    );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyDocPage');
  }


  getMydoc(custNo){
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 5000
    });
    loader.present();
  
    this.http.get(Enums.APIURL.URL+'fetchmydocs/'+custNo).map(res => res.json()).subscribe(data => {//categroies :
      // debugger;
       var obj = JSON.parse(data);
         this.posts = obj; 
         console.log(this.posts);
        //  this.loading.dismiss();
        if(this.posts[0] === undefined){
          //  alert("No schemes found...");
          this.nodata=true;

         }else{
           this.nodata=false;
         }
         loader.dismiss();
        },err => {
          console.log(err);
          // this.loading.dismiss();
          loader.dismiss();
        });
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
    this.urlapp = Enums.APIURL.WEB_APP_URL+'MyDocs/';
    this.iab.create(this.urlapp + urlText,target,this.options);
  
  
  }
}
