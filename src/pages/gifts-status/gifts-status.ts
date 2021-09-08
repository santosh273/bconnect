import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import * as Enums from '../../models/interfaces/enums';
import { NativeStorage } from '@ionic-native/native-storage';
/**
 * Generated class for the GiftsStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gifts-status',
  templateUrl: 'gifts-status.html',
})
export class GiftsStatusPage {
  userId: any;
  gifts:any;
  public imageUrl =Enums.APIURL.WEB_APP_URL+"FilesFolder/"
  constructor(public loadingCtrl:LoadingController,public nativeStorage:NativeStorage,public navCtrl: NavController, public navParams: NavParams,public http:HttpInterceptor) {
    
    this.nativeStorage.getItem('userID')//userid
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.userId = data;
      this.getGifts();
     }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GiftsStatusPage');
  }
  getGifts(){
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
    });
  
    loading.present();
    this.http.get(Enums.APIURL.URL+'getcustomergiftrequest/'+this.userId).map(res=>res.json()).subscribe(data=>{
      loading.dismiss();
      var obj = JSON.parse(data);
      this.gifts = obj;
      console.log(obj);
    },err => {
      loading.dismiss();
       alert(err);
     
       console.log(err)});
  }

}
