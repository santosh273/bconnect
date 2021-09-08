import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { Http } from '@angular/http';
import * as Enums from '../../models/interfaces/enums';
import {Observable} from 'rxjs/Rx';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';


/**
 * Generated class for the ComplainsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-complains',
  templateUrl: 'complains.html',
})
export class ComplainsPage {
  posts:any;
  nodata:any;
  userId:any;
  loading:any;


  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,private nativeStorage: NativeStorage,private http: HttpInterceptor) {
  
    ///get user id:
    this.nativeStorage.getItem('userID')//userid
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.userId = data;
      console.log("User Id:" + this.userId);
      this.getComplainsList(this.userId);
    },
    error => console.error(error)
    );


    //end

    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: `
        
        <div>Loading...</div>`,
     
    });
    Observable.interval(2000 * 60).subscribe(x => {
      this.getComplainsList(this.userId);
      console.log('intervel:this.getRejected(this.userId);');
    });
  
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComplainsPage');

  }

  getComplainsList(userId:any){
    this.loading.present();
    this.http.get(Enums.APIURL.URL+'fetchbindcomplain/'+userId).map(res => res.json()).subscribe(data => {
      // debugger;
        console.log(data);
        var obj = undefined;
        try {
          if(data!="")
          {
            console.log("Paresed Jason");
            obj=JSON.parse(data);
          }
      } catch(e) {
         
      }
      // alert(obj[0].userName);
         this.posts = obj; 
         console.log(this.posts);
         this.loading.dismiss();
         if(this.posts === undefined){
          this.nodata = true;
        }
        else{
          this.nodata = false;
        }
        
    
        },err => {
          this.loading.dismiss();
          console.log(err);
        });
  }

  gotoDetails(comp:any){
    this.navCtrl.push('ViewCompDetailsPage',{comp:comp});

  }

  complain(){
    this.navCtrl.push('MakeAComplainPage');
  }

}
