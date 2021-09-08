import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import * as Enums from '../../models/interfaces/enums'
/**
 * Generated class for the ViewProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfilePage {

  user=[];
  customerNo="";
  public filesfolder=Enums.APIURL.WEB_APP_URL+'/filesfolder/'

  constructor(private http: HttpInterceptor,public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,private nativeStorage: NativeStorage) {
    this.nativeStorage.getItem('profile')//EmpIDX2
    .then(
    data => {
      // console.log("URID from page dashoard" + data);
      this.user = data;
     // this.customerNo=this.user[0].customerNo;
      console.log('THIS.USER OBJ FETCH USER DETAILS'+this.user);
      for(let u of this.user){
        this.customerNo=u.customerNo;
        console.log(u);
        if(u.userTypeIdx == '4' || u.userTypeIdx == 4){
          this.refresh();
        }
      
      }
       console.log("userName:" + this.user[0].name);
      
    },
    error => console.error(error)
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewProfilePage');
  }
  update(email,address,phoneNo1){
    this.navCtrl.push('ProfilePage',{email:email,address:address,phoneno:phoneNo1,customerNo:this.customerNo});
  }
  refresh(){
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      
    });
    loader.present();
    ///*****getZones****/////
    this.http.get(Enums.APIURL.URL+'fetchuserdetailsbyusername/'+this.customerNo).map(res => res.json()).subscribe(data => {
      
      this.user= JSON.parse(data);
      console.log(this.user);
      for(let u of this.user){
        this.customerNo=u.customerNo;
        console.log(u);
      }
      loader.dismiss();
    
      
    }, err => {
      loader.dismiss()
      console.log(err);
     
    });
    //end
}

}
