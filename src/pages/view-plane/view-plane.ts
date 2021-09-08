import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import * as Enums from '../../models/interfaces/enums';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the ViewPlanePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-plane',
  templateUrl: 'view-plane.html',
})
export class ViewPlanePage {

  userIDX: any;
  plans: any;
  constructor(public loadingCtrl:LoadingController,public nativeStorage:NativeStorage ,public navCtrl: NavController, public navParams: NavParams,public http:HttpInterceptor) {
    this.nativeStorage.getItem('userID')
    .then(
    data => {
      console.log("URID from page sigin" + data);
      this.userIDX = data;
      console.log(this.userIDX);
      //this.userIDX='1017'
     this.getPlans(this.userIDX);
     
    },
    error => console.error(error)
    ); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewPlanePage');
  }

  getPlans(IDX){
    let loder=this.loadingCtrl.create({
      spinner: 'dots',
    });
    loder.present()
    this.http.get(Enums.APIURL.URL+'getcpbp/'+IDX).map(res=>res.json()).subscribe(data=>{
     var obj = JSON.parse(data);
      this.plans = obj;
      loder.dismiss();
      console.log(this.plans);
    },err => {
      // alert(err);
      loder.dismiss();
       console.log(err)});
  }

  details(IDX,YEAR){
    this.navCtrl.push('ViewPlanDetailsPage',{IDX:IDX,YEAR:YEAR});
    console.log(IDX," : ",YEAR);
  }
}
