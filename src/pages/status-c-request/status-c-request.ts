import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import * as Enums from '../../models/interfaces/enums';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import { NativeStorage } from '@ionic-native/native-storage';
/**
 * Generated class for the StatusCRequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-status-c-request',
  templateUrl: 'status-c-request.html',
})
export class StatusCRequestPage {
  user: any;
  requests: any;
  nodata: boolean=true;
  constructor(private nativeStorage: NativeStorage,public events: Events,public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,private http: HttpInterceptor) {
    this.events.publish('user:created', "user", Date.now());
    this.nativeStorage.getItem('profile')//EmpIDX2
  .then(
  data => {
    console.log("URID from page dashoard" + data);
    this.user = data;
     console.log("userName:" + this.user[0]);
     console.log('DESI::::',this.user[0].designationIdx);
    // this.getAllRequests(this.user[0].idx2)
     console.log(this.user[0].idx2);
    
  },
  error => console.error(error)
  );
 
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatusCRequestPage');
  }
  ionViewDidEnter(){
    this.getAllRequests(this.user[0].idx2)
    console.log('ionViewDidEnter StatusCRequestPage');
  }
  ionViewWillEnter(){
    console.log('ionViewWillEnter StatusCRequestPage');
  }
 
 
  arrayOne(n: number): any[] {
    return Array(n);
  }

  getAllRequests(EMPIDX:any){
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
     
    });
    loader.present();
    console.log('getnoti',Enums.APIURL.URL+'getcustomerrequests/'+ EMPIDX);
    this.http.get(Enums.APIURL.URL+'getcustomerrequests/'+ EMPIDX).map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      // alert(obj[0].userName);
    
         this.requests = obj; 
         console.log('nodata('+this.requests+")");
         loader.dismiss();
        //  console.log(this.Notifications);
         if(this.requests === undefined || this.requests.length == 0){
          this.nodata = true;

        }
        else{
          this.nodata = false;
        }
    
        },err => {
          console.log(err);
        });
        
  }

  viewDetails(req:any){//sales order
    this.navCtrl.push('CDetailsPage',{REQ:req});
    
   
  }
}

// \"Row\":1,\
// "idx\":8074,
// \"customerNo\":\"0\",
// \"customerName\":\"ABC Customer1\
// ",\"pocketIdx\":7,\
// "pocketName\":\"Jati\
// ",\"ApprovalDate\":\"2018-11-06T16:52:01.457\
// ",\"ModifiedDate\":\"2018-11-06T16:52:01.457\"
// ,\"email\":\"ridafatima@a2zcreatorz.com\"
// ,\"phoneNo1\":\"9953214\"
// ,\"creationDate\":\"2018-06-26T15:10:39.807\
// ",\"waitingIn\":\"Rejected\",
// \"waitingIn2\":\"\",
// \"vis\":1,
// \"useridx\":8030,\"
// propretiorName\":\"ABC Customer1\"
// ,\"decisionMaker\":\"ABC Customer1\
// ",\"decisionMakerContactNo\":\"98706543\"
// ,\"address\":\"abc-1233\",
// \"city\":\"1004\",
// \"phoneNo11\":\"9953214\",
// \"phoneNo2\":\"9953214\",\
// "phoneNo3\":\"9953214\",
// \"areaName\":\"karachi\",
// \"ntn\":\"wert\"
// ,\"cnic\":\"24566-7889907-6\",
// \"category\":\"2\",\"expairyDate\":\"08\/06\/2018\",
// \"salesoffice\":\"\",\
// "salesDistrict\":\"\",
// \"latitude\":\"24.8292176\",
// \"longitude\":\"67.0762584\",
// \"loginid\":\"ABCCustomer1\"
