import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http } from '@angular/http';
import * as Enums from '../../models/interfaces/enums';
import { ViewDetailsPage } from '../view-details/view-details';
import { MakeNewOrderPage } from '../make-new-order/make-new-order';
import {Observable} from 'rxjs/Rx';

/**
 * Generated class for the RejectedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rejected',
  templateUrl: 'rejected.html',
})
export class RejectedPage {
  
  @ViewChild(Navbar) navBar: Navbar;

  userId:any;
  posts:any;
  salestype:any;
  showorder:any;
  showreturn:any;
  pageTitle:any;
  loading:any;
  nodata = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,private nativeStorage: NativeStorage,private http: Http) {
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
    );//salestype

    this.nativeStorage.getItem('userID')
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.userId = data;
      console.log("User Id:" + this.userId);
      this.getRejected(this.userId);
    }
    );

     ////loader
     this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: `
        
        <div>Loading...</div>`,
     
    });
    

    Observable.interval(2000 * 60).subscribe(x => {
      this.getRejected(this.userId);
      console.log('intervel:this.getRejected(this.userId);');
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RejectedPage');
    this.navBar.backButtonClick = (e: UIEvent) => {
      console.log("Back button clicked");
      this.navCtrl.parent.viewCtrl.dismiss();
    };
  }
  getRejected(userId:string){
    if(this.salestype==='order')
    {
      this.showorder=true;
      this.showreturn=false;
      this.pageTitle="Sales Order-Rejected";
      this.loading.present();
    this.http.get(Enums.APIURL.URL+'fetchsalesorderdetails/'+userId+'/2').map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      // alert(obj[0].userName);
         this.posts = obj; 
         console.log(this.posts);
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
       
      }else
      {
        this.showreturn=true;
        this.showorder=false;
        this.pageTitle="Sales Return-Rejected";
        this.loading.present();
        this.http.get(Enums.APIURL.URL+'fetchSalesReturnList/'+userId+'/2').map(res => res.json()).subscribe(data => {
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
  viewReurn(Idx:string){
    this.navCtrl.push('ViewReturnPage',{IDX:Idx});
  }
  ionViewWillUnload() {
    this.loading.dismiss();
    console.log('ionViewWillUnload');
  }

}
