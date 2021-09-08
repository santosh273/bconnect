import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Headers,RequestOptions } from '@angular/http';
import * as Enums from '../../models/interfaces/enums';
import { ViewDetailsPage } from '../view-details/view-details';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';

/**
 * Generated class for the AsoNotificationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aso-notification-list',
  templateUrl: 'aso-notification-list.html',
})
export class AsoNotificationListPage {

  nodata: boolean;
  Notifications: any;
  EMPIDX:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private nativeStorage: NativeStorage,public loadingCtrl: LoadingController,private http: HttpInterceptor) {
    this.EMPIDX = this.navParams.get('EMPIDX');
    this.getAllNotifcations(this.EMPIDX);
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AsoNotificationListPage');
  }

  // ionViewDidEnter(){
  //   this.nativeStorage.getItem('userID')
  //   .then(
  //   data => {
  //     console.log("URID from page sigin" + data);
  //     this.getAllNotifcations(this.EMPIDX);
    
     
  //   },
  //   error => console.error(error)
  //   ); 
  // }

  getAllNotifcations(EMPIDX:any){
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
     
    });
    loader.present();
    console.log('getnoti');
    this.http.get(Enums.APIURL.URL+'fetchPendingNotificationsEMP/'+ EMPIDX).map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      // alert(obj[0].userName);
         this.Notifications = obj; 
         loader.dismiss();
        //  console.log(this.Notifications);
         if(this.Notifications === undefined ){
          this.nodata = true;

        }
        else{
          this.nodata = false;
        }
    
        },err => {
          console.log(err);
        });
        
  }

  viewDetails(Idx:string){//sales order
    this.navCtrl.push(ViewDetailsPage,{IDX:Idx});
    this.updateNoti(this.EMPIDX);
  }

  updateNoti(userId){
    // console.log(this.imagebyte);
    // var url = "http://webapps.a2zcreatorz.com/Bayer/DIS.svc/SavePng";
    let headers1 = new Headers(
      {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      });
   
 
      let options = new RequestOptions({ headers: headers1 });
      
      
  
     
      return new Promise((resolve, reject) => {
        this.http.post(Enums.APIURL.URL+'updateASONotifications/'+ userId, options)
        .toPromise()
        .then((response) =>
        {
        
          console.log('API Response : ', response.json());
        //  this.showAlert("Bayer","Your feedback has been sent to Bayer.\n Thankyou.");
          // this.navCtrl.setRoot(HomePage);
         // this.navCtrl.push('AsoListPage');
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
