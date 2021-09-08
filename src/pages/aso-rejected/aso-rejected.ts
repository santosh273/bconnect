import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import * as Enums from '../../models/interfaces/enums';
import { ViewDetailsPage } from '../view-details/view-details';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';

/**
 * Generated class for the AsoRejectedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aso-rejected',
  templateUrl: 'aso-rejected.html',
})
export class AsoRejectedPage {
  @ViewChild(Navbar) navBar: Navbar;
  loading:any;
  EmpIDX2:any;
  posts:any;
  nodata:any;

constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,private nativeStorage: NativeStorage,private http: HttpInterceptor) {
 
 
  this.nativeStorage.getItem('EmpIDX2')//EmpIDX2
  .then(
  data => {
    console.log("URID from page dashoard" + data);
    this.EmpIDX2 = data;
    console.log("User Id:" + this.EmpIDX2);
    this.getCompleted(this.EmpIDX2);
  },
  error => console.error(error)
  );

  this.loading = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: `
      
      <div>Loading...</div>`,
   
  });
}

ionViewDidLoad() {
  console.log('ionViewDidLoad AsoCompletedPage');
  // @ViewChild(Navbar) navBar: Navbar;
  console.log('ionViewDidLoad CompletedPage');
  this.navBar.backButtonClick = (e: UIEvent) => {
    console.log("Back button clicked");
    this.navCtrl.parent.viewCtrl.dismiss();
  };
}

getCompleted(emdidx:any){
  this.loading.present();
  this.http.get(Enums.APIURL.URL+'fetchadminsalesorderviewlist/'+emdidx+'/2').map(res => res.json()).subscribe(data => {
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
        this.loading.dismiss();
        console.log(err);
      });
}
viewDetails(Idx:string){
  this.navCtrl.push(ViewDetailsPage,{IDX:Idx});
}

}
