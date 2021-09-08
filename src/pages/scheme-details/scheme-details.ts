import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import * as Enums from '../../models/interfaces/enums';
import { Http, RequestOptions,Headers } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';

/**
 * Generated class for the SchemeDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scheme-details',
  templateUrl: 'scheme-details.html',
})
export class SchemeDetailsPage {
  userIdx: any;
  scheme:any;
  urlapp:any;

  constructor(public navCtrl: NavController,private nativeStorage: NativeStorage, public navParams: NavParams, private iab: InAppBrowser,public http:HttpInterceptor) {
   this.scheme = this.navParams.get('Scheme');
   console.log(this.scheme);
   this.nativeStorage.getItem('userID')
   .then(
   data => {
     console.log("URID from page dashoard" + data);
     this.userIdx = data;
     console.log("User Id:" + this.userIdx);
     this.updateNotification(this.userIdx,this.scheme.idx);
     // this.getPending(this.userId);
   },
   error => console.error(error)
   );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchemeDetailsPage');
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

updateNotification(userId,idx){
  console.log(userId,idx);
  var name ="Schemes";
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
