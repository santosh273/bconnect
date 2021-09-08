import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http } from '@angular/http';
import * as Enums from '../../models/interfaces/enums';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
/**
 * Generated class for the ViewStockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-stock',
  templateUrl: 'view-stock.html',
})
export class ViewStockPage {

  PIdx: any;
  nodata: boolean;
  Products: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private nativeStorage: NativeStorage,public loadingCtrl: LoadingController,private http: HttpInterceptor) {
  this.PIdx=this.navParams.get('PIDX');
  this.getProductDetails(this.PIdx);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewStockPage');
  }

  getProductDetails(pIdx){
    console.log('products');
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
     
    });
    loader.present();
    console.log('getnoti');
    this.http.get(Enums.APIURL.URL+'fetchcustomerstockproduct/'+ pIdx).map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      // alert(obj[0].userName);
         this.Products = obj; 
         loader.dismiss();
        //  console.log(this.Notifications);
         if(this.Products === undefined ){
          this.nodata = true;

        }
        else{
          this.nodata = false;
        }
    
        },err => {
          console.log(err);
        });
        
  }

}
