import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http } from '@angular/http';
import * as Enums from '../../models/interfaces/enums';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
/**
 * Generated class for the StockEnteryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stock-entery',
  templateUrl: 'stock-entery.html',
})
export class StockEnteryPage {

  posts: any;
  nodata: boolean = false;
  loading: any;
  userId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private nativeStorage: NativeStorage, public loadingCtrl: LoadingController, private http: HttpInterceptor) {
   
    this.loading=this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
      
    });
    this.nativeStorage.getItem('userID')//userid
      .then(
        data => {
          console.log("URID from page dashoard" + data);
          this.userId = data;
          console.log("User Id:" + this.userId);
          this.getStockEntries(this.userId);
        },
        error => console.error(error)
      );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StockEnteryPage');
  }


  // getStockEntries(){
  //   this.http.get(Enums.APIURL.URL+'fetchnotificationgroupbyidx/'+ userId).map(res => res.json()).subscribe(data => {
  //     // debugger;
  //      var obj = JSON.parse(data);
  //     // alert(obj[0].userName);
  //        this.unRead = obj; 
  //        console.log(this.unRead);
  //        this.getAllUnread(this.unRead);

  //       //  this.loading.dismiss();

  //       },err => {
  //         console.log(err);
  //         alert(err);
  //       });
  // }
  getStockEntries(userid: any) {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
      
    });
    loader.present();
    // + userid + '/0'
    this.http.get(Enums.APIURL.URL + 'fetchstock/'+userid).map(res => res.json()).subscribe(data => {
      // debugger;
      var obj = JSON.parse(data);
      // alert(obj[0].userName);
      this.posts = obj;
      console.log(this.posts);
      if (this.posts[0] === undefined) {
        this.nodata = true;

      }
      else {
        this.nodata = false;
      }
      loader.dismiss();

    }, err => {
      loader.dismiss();
      console.log(err);
    });
  }

  ViewProduct(pidx){
    this.navCtrl.push('ViewStockPage',{PIDX:pidx});
  }

  newStock(){
    this.navCtrl.push('MakeStockPage');
  }
  ionViewDidEnter() {
    this.getStockEntries(this.userId);
  }
  ionViewWillUnload() {
    this.loading.dismissAll();
    console.log('ionViewWillUnload');
  }
}
