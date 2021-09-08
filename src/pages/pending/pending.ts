import { Component, ViewChild,Pipe } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http } from '@angular/http';
import * as Enums from '../../models/interfaces/enums';
import { ViewDetailsPage } from '../view-details/view-details';
import { MakeNewOrderPage } from '../make-new-order/make-new-order';
import {Observable} from 'rxjs/Rx';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';


/**
 * Generated class for the PendingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pending',
  templateUrl: 'pending.html',
})
export class PendingPage {
  @ViewChild(Navbar) navBar: Navbar;
  pageTitle:any;
  userId:any;
  posts:any;
  date:any;
  salestype:any;
  showorder:any;
  showreturn:any;
  loading:any;
  nodata=false;
  
  constructor(public navCtrl: NavController,public loadingCtrl: LoadingController, public navParams: NavParams,private nativeStorage: NativeStorage,private http: HttpInterceptor) {
    // this.userId = navParams.get('userID');
    // console.log("pending"+this.userId);

    ///geting data from native////
    this.nativeStorage.getItem('salesType')
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.salestype = data;
      console.log("User Id:" + this.salestype);
     // this.getPending(this.userId);
    },
    error => console.error(error)
    );

    this.nativeStorage.getItem('userID')
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.userId = data;
      console.log("User Id:" + this.userId);
      
      this.getPending(this.userId);
    },
    error => console.error(error)
    );
    ////loader
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: `
        
        <div>Loading...</div>`,
     
    });

    Observable.interval(2000 * 60).subscribe(x => {
      this.getPending(this.userId);
      console.log('intervel');
    });
   
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PendingPage');
    this.navBar.backButtonClick = (e: UIEvent) => {
      console.log("Back button clicked");
      this.navCtrl.parent.viewCtrl.dismiss();
    };
  }
  ionViewDidLeave(){
    console.log('leaving');
    
  }
  ionViewWillUnload() {
    this.loading.dismiss();
    console.log('ionViewWillUnload');
  } 
  // ionViewWillEnter() {
  //   let elements  = document.querySelectorAll('.tabbar');
  //   if ( elements  !== null ) {
  //     console.log("tabs");
  //     Object.keys(elements).map((key) => {
  //       elements[key].style.display = 'block';
  //   });
     
  //   } // end if
  // }


  getPending(userId:string){
    console.log(this.salestype);
    if(this.salestype==='order')
      {
        this.showorder=true;
        this.showreturn=false;
        this.pageTitle="Sales Order-Pending";
        this.loading.present();
        this.http.get(Enums.APIURL.URL+'fetchsalesorderdetails/'+userId+'/0').map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      // alert(obj[0].userName);
         this.posts = obj; 
         if(this.posts[0] === undefined){
          this.nodata = true;

        }
        else{
          this.nodata = false;
        }
         console.log(this.posts);
         this.loading.dismiss()
        //  console.log;
    
        },err => {
          this.loading.dismiss();
          console.log(err);
        });
      ;}//if ends
        else{
          this.showreturn=true;
          this.showorder=false;
          this.pageTitle="Sales Return-Pending";
          this.loading.present();
          this.http.get(Enums.APIURL.URL+'fetchSalesReturnList/'+userId+'/0').map(res => res.json()).subscribe(data => {
        // debugger;
         var obj = JSON.parse(data);
        // alert(obj[0].userName);
           this.posts = obj; 
           if(this.posts[0] === undefined){
            this.nodata = true;
  
          }
          else{
            this.nodata = false;
          }
           console.log(this.posts);
           this.loading.dismiss();
          //  console.log;
      
          },err => {
            console.log(err);
            this.loading.dismiss();
          });
         
        }

  }

  viewDetails(Idx:string){
    this.navCtrl.push(ViewDetailsPage,{IDX:Idx});
  }
  viewReurn(Idx:string){
    this.navCtrl.push('ViewReturnPage',{IDX:Idx});
  }
  newOrder(){
    if(this.salestype==="order"){
      this.navCtrl.push(MakeNewOrderPage);
    }else{
      this.navCtrl.push('MakeNewReturnPage');
    }
   
  } 
  // ionViewDidLeave() {
  //   let elements  = document.querySelectorAll('.tabbar');
  //   if ( elements  !== null ) {
  //     console.log("tabs");
  //     Object.keys(elements).map((key) => {
  //       elements[key].style.display = 'none';
  //   }); // end if
  // }
  // }

}
