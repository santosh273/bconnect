import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import * as Enums from '../../models/interfaces/enums';

/**
 * Generated class for the ViewPlanDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-plan-details',
  templateUrl: 'view-plan-details.html',
})
export class ViewPlanDetailsPage {

  plan: any;
  constructor(public loadingCtrl:LoadingController,public navCtrl: NavController, public navParams: NavParams,public http:HttpInterceptor) {
  this.getPlanDetails(this.navParams.get('IDX'),this.navParams.get('YEAR'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewPlanDetailsPage');
  }

  getPlanDetails(IDX,YEAR){
    let loder=this.loadingCtrl.create({
      spinner: 'dots',
    });
    loder.present();
    this.http.get(Enums.APIURL.URL+'getcpbpdetails/'+IDX+"/"+YEAR).map(res=>res.json()).subscribe(data=>{
     var obj = JSON.parse(data);
      this.plan = obj;
      loder.dismiss();
      console.log(this.plan);
    },err => {
      // alert(err);
      loder.dismiss();
       console.log(err)});
  }

}
