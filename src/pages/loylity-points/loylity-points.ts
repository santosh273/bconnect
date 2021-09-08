import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import 'rxjs/add/operator/map';
import * as Enums from '../../models/interfaces/enums';
import { NativeStorage } from '@ionic-native/native-storage';


/**
 * Generated class for the LoylityPointsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loylity-points',
  templateUrl: 'loylity-points.html',
})
export class LoylityPointsPage {
  totalPoints: any;
  code: any;
  user: any;
  points: any;
  requested: number;
  consumed: number;
  available: number;
  tpoints: number;
  bgp: number;
  bgpcheck : any = 0;
  constructor(public loadingCtrl: LoadingController, public nativeStorage: NativeStorage, public http: HttpInterceptor, public navCtrl: NavController, public navParams: NavParams) {

    this.nativeStorage.getItem('profile')//EmpIDX2
      .then(
        data => {
          console.log("URID from page dashoard" + data);
          this.user = data;

          this.code = this.user[0].customerNo;
          // this.name=this.user[0].firstName +" "+this.user[0].lastName
          console.log("userName:" + this.user[0].firstName + this.user[0].lastName);
          this.getPoints();
        },
        error => console.error(error)
      );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoylityPointsPage');
  }
  getPoints() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
    });

    loading.present();
    let updated = 0;
    let bgp = 0;
    
    this.http.get(Enums.APIURL.URL + 'getcustomerpoints/' + this.code).map(res => res.json()).subscribe(data => {
      console.log(Enums.APIURL.URL + 'getcustomerpoints/' + this.code);
      loading.dismiss();
      var obj = JSON.parse(data);
      this.points = obj;
      for (let p of this.points) {

        this.totalPoints = p.totalpoints;
        this.bgpcheck = p.bgpcheck;

        if (p.labels != 'BGP') {
          updated += Number(p.updated);
        }
        else {
          bgp += Number(p.updated);

        }
        this.requested = Number(p.requestedpoints);
        this.consumed = Number(p.consumedpoints);
        this.available = Number(p.availablepointstotal);
        console.log(this.totalPoints);
      }
      console.log("updated " + updated);
      this.tpoints = updated;
      this.bgp = bgp;
      // if(this.bgpcheck == 0)
      // {
      //   var key = "bgp";
      //   delete this.points[key];

      // }
      console.log(obj);

    }, err => {
      loading.dismiss();
      alert(err);

      console.log(err)
    });
  }

}
