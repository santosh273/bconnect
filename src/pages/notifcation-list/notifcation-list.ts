import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http } from '@angular/http';
import * as Enums from '../../models/interfaces/enums';
import { ViewDetailsPage } from '../view-details/view-details';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';


/**
 * Generated class for the NotifcationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-notifcation-list',
  templateUrl: 'notifcation-list.html',
})
export class NotifcationListPage {

  limit: any;
  name: any;
  posts:any;
  nodata:any;
  loading:any;
  userIDX:any;  
  
  constructor(public navCtrl: NavController, public navParams: NavParams,private nativeStorage: NativeStorage,public loadingCtrl: LoadingController,private http: HttpInterceptor) {
    this.name = navParams.get('Name');
    this.limit =navParams.get('Lim');
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: `
        
        <div>Loading...</div>`,
     
    });
    this.nativeStorage.getItem('userID')
    .then(
    data => {
      console.log("URID from page sigin" + data);
      this.userIDX = data;
      console.log(this.userIDX);
     this.getAllPendingNotifcations(this.userIDX,this.name);
     
    },
    error => console.error(error)
    ); 
  
  }

  ionViewDidEnter(){
    this.nativeStorage.getItem('userID')
    .then(
    data => {
      console.log("URID from page sigin" + data);
      this.userIDX = data;
      console.log(this.userIDX);
     this.getAllPendingNotifcations(this.userIDX,this.name);
     
    },
    error => console.error(error)
    ); 
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NotifcationListPage');
  }


  getAllPendingNotifcations(userId:any,name){
    return new Promise((resolve=>{
      this.loading.present();
      this.http.get(Enums.APIURL.URL+'fetchpendingnotifications/'+userId+'/'+name).map(res => res.json()).subscribe(data => {
        // debugger;
         var obj = JSON.parse(data);
        // alert(obj[0].userName);
           this.posts = obj; 
           console.log(this.posts);
           resolve(true);
           if(this.posts[0] === undefined){
            this.nodata = true;
  
          }
          else{
            this.nodata = false;
          }
           this.loading.dismiss();
      
          },err => {
            console.log(err);
            this.loading.dismiss();
          });
    }));
    // console.log(name);
   
  }

  viewReurn(Idx:string){
    this.navCtrl.push('ViewReturnPage',{IDX:Idx});
  }
  viewScheme(scheme:any){
    console.log(scheme);
    this.navCtrl.push('SchemeDetailsPage',{Scheme:scheme});
    
  }
  viewDetails(Idx:string){//sales order
    this.navCtrl.push(ViewDetailsPage,{IDX:Idx});
  }

  gotoDetails(comp:any){
    this.navCtrl.push('ViewCompDetailsPage',{comp:comp});

  }
}
