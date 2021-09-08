import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http,Headers, RequestOptions } from '@angular/http';
import * as Enums from '../../models/interfaces/enums';
import { NativeStorage } from '@ionic-native/native-storage';
import { InAppBrowserOptions, InAppBrowser } from '@ionic-native/in-app-browser';
import {Observable} from 'rxjs/Rx';
import { Content } from 'ionic-angular';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import { CustAlert } from '../../providers/cust-alert/cust-alert';

/**
 * Generated class for the ViewCompDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-comp-details',
  templateUrl: 'view-comp-details.html',
})
export class ViewCompDetailsPage {
  userIdx: any;
  @ViewChild(Content) content: Content;
  urlapp: string;
  comp:any;
  details:any;
  loading:any;
  comment:any;
  userId:any;
  constructor(public navCtrl: NavController, private iab: InAppBrowser, public navParams: NavParams,private nativeStorage: NativeStorage,public loadingCtrl: LoadingController,private http: HttpInterceptor,private custAlert:CustAlert) {

    this.comp = this.navParams.get('comp');
    console.log(this.comp);
    console.log(this.comp.Idx);
///get user id:
this.nativeStorage.getItem('crtdbyID')//userid
.then(
data => {
  console.log("URID from page dashoard" + data);
  this.userId = data;
  console.log("User Id:" + this.userId);
  console.log(this.comp);
  console.log(this.comp.Idx);
  // this.updateNotification(this.userId,this.comp.Idx);
 
},
error => console.error(error)
);

this.nativeStorage.getItem('userID')
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.userIdx = data;
      console.log("User Id:" + this.userIdx);
      this.updateNotification(this.userIdx,this.comp.Idx);
      // this.getPending(this.userId);
    },
    error => console.error(error)
    );


//end

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: `
        
        <div>Loading...</div>`,
     
    });
    this.getComments(this.comp.Idx);

    Observable.interval(200 * 60).subscribe(x => {
      this.getComments(this.comp.Idx);
      this.content.scrollToBottom();
      console.log('intervel:getComments');
    });
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewCompDetailsPage');
  }

  getComments(idx:any){
    this.loading.present();
    this.http.get(Enums.APIURL.URL+'fetchbindcomplaindetail/'+idx).map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      // alert(obj[0].userName);
         this.details = obj; 
         console.log(this.details);
        //  if(this.posts[0] === undefined){
        //   this.nodata = true;

        // }
        // else{
        //   this.nodata = false;
        // }
         this.loading.dismiss();
    
        },err => {
          console.log(err);
        });
  }

    postComment(){
      if(this.comment != undefined && this.comment!=''){
        let headers1 = new Headers(
          {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
          });
       
     
          let options = new RequestOptions({ headers: headers1 });
          
       
           let data = JSON.stringify(
            {
              "CustomerComplainIdx":this.comp.Idx,
              "Comment":this.comment,
              "ReplyUsersIdx":this.userId,
              "Remarks" : ""
             
              
         });
         console.log(data);
          this.loading.present();
          return new Promise((resolve, reject) => {
            this.http.post(Enums.APIURL.URL+'postcustomercomplaindetails', data, options)
            .toPromise()
            .then((response) =>
            {
            
              console.log('API Response : ', response.json());
              this.loading.dismiss();
              this.comment=null;
              this.getComments(this.comp.Idx);
              
              
              resolve(response.json());
            })
            .catch((error) =>
            {
              console.error('API Error : ', error.status);
              console.error('API Error : ', JSON.stringify(error));
              reject(error.json());
            });
          });
      }else{
        this.custAlert.presentAlert('Required','Please fill the comment box.');
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
      Viewfile(urlText: string) {
        var folfile= urlText.split("~/FilesFolder/");
        // console.log(folfile[1]);
        // console.log(folfile[0]);
        var file=folfile[1];
        console.log(file);
        let target = "_system";
        this.urlapp = Enums.APIURL.WEB_APP_URL+'FilesFolder/';
        this.iab.create(this.urlapp + file,'_blank','location=no,toobar=no');
      
      
      }
      updateNotification(userId,idx){
        console.log(userId,idx);
        var name ="Complains";
        let headers1 = new Headers(
          {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
          });
       
     
          let options = new RequestOptions({ headers: headers1 });
          
       
         
          this.loading.present();
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
