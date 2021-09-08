import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http, RequestOptions,Headers } from '@angular/http';
import * as Enums from '../../models/interfaces/enums';
import { InAppBrowserOptions, InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeStorage } from '@ionic-native/native-storage';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';

/**
 * Generated class for the ViewDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-view-details',
  templateUrl: 'view-details.html',
})
export class ViewDetailsPage {
  time: any;
  orderDat: any;
  territory: "";
  empIdxx: any;
  orderFor: any;
  orderBy: any;
  userIdx: any;
  idx:string;
  order:any;
  products:any;
  payments:any;
  orderNO:any;
  status:any;
  date:any;
  loading:any;
  urlapp:any;
  remarks="";
  reason="";
  customerNo="";
  customerName="";
  completedby="";
  completedDate="";
  tabBarElement:any;
  constructor(public navCtrl: NavController,private nativeStorage: NativeStorage, public navParams: NavParams,public loadingCtrl: LoadingController,private http: HttpInterceptor, private iab: InAppBrowser) {
    this.tabBarElement = document.querySelector('#tabs ion-tabbar-section');
    this.idx = navParams.get('IDX');
    console.log(this.idx);

    this.nativeStorage.getItem('userID')
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.userIdx = data;
      console.log("User Id:" + this.userIdx);
      this.updateNotification(this.userIdx,this.idx);
      // this.getPending(this.userId);
    },
    error => console.error(error)
    );

    ////loader
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: `
        
        <div>Loading...</div>`,
     
    });
    this.loading.present();
    this.viewOrder(this.idx);
    this.viewPayements(this.idx);
    this.viewProducts(this.idx)
    this.loading.dismiss();

  }


  ionViewDidLoad() {
    this.tabBarElement.style.display = 'none';
    console.log('ionViewDidLoad ViewDetailsPage');
  }

  viewOrder(idx:string){
    console.log('idx:',idx);
    this.http.get(Enums.APIURL.URL+'fetchsalesorderdetailsbyidx/'+idx).map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      // alert(obj[0].userName);
         this.order = obj[0]; 
         console.log(this.order);
         console.log(this.order.orderNo);
         this.orderNO=this.order.orderNo;
         this.status=this.order.status;
         this.date=this.order.orderDatee;
         this.orderBy=this.order.orderby;
         this.orderFor=this.order.orderfor;
         this.remarks= this.order.adminRemarks;
         this.reason=this.order.reasonName
         this.empIdxx=this.order.empIdx;
         this.customerNo=this.order.customerNo;
         this.customerName=this.order.customerName;
         this.completedby=this.order.completedby;
         this.completedDate=this.order.completiondate;
         this.territory =this.order.territoryName;
         this.orderDat= this.order.orderDate;
         this.time =this.order.orderTime;
         console.log(this.orderBy,"++",this.orderFor)
         console.log;
    
        },err => {
          console.log(err);
        });
  }
  viewPayements(idx:string){
    this.http.get(Enums.APIURL.URL+'fetchsalesorderbankdetailsbyidx/'+idx).map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      // alert(obj[0].userName);
         this.payments = obj; 
         console.log(this.payments);
        //  console.log;
    for(let i of this.payments){
      console.log('atchment_json: '+JSON.stringify(i));
      console.log('atchment: '+i.Attachment);
      console.log('atchment_json: '+JSON.stringify(i.Attachment));
    }
        },err => {
          console.log(err);
        });

  }
  viewProducts(idx:string){
    this.http.get(Enums.APIURL.URL+'fetchsalesorderproductdetailsbyidx/'+idx).map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      // alert(obj[0].userName);
         this.products = obj; 
         console.log(this.products);
        //  console.log;
    
        },err => {
          console.log(err);
        });

  }

  //   ionViewDidLeave(){
  //     let elem = <HTMLElement>document.querySelector(".tabbar");
  //     if (elem != null) {
  //       elem.style.display = 'block';
  //     }

  //   //  this.tabBarElement.style.display = 'block';

  // }


  options : InAppBrowserOptions = {
    location : 'yes',//Or 'no' 
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only 
    closebuttoncaption : 'Close', //iOS only
    disallowoverscroll : 'no', //iOS only 
    toolbar : 'yes', //iOS only 
    enableViewportScale : 'no', //iOS only 
    allowInlineMediaPlayback : 'no',//iOS only 
    presentationstyle : 'pagesheet',//iOS only 
    fullscreen : 'yes',//Windows only   
    hideurlbar:'yes',
    footer:'no'
};

Viewfile(urlText: string) {
  let target = "_system";
  this.urlapp = Enums.APIURL.WEB_APP_URL+'FilesFolder/';
  this.iab.create(this.urlapp + urlText,'_blank','location=no,toolbar=no');
}
updateNotification(userId,idx){
  console.log(userId,idx);
  var name ="Sales Order";
  let headers1 = new Headers(
    {
      'Accept' : 'application/json',
      'Content-Type' : 'application/json'
    });
 

    let options = new RequestOptions({ headers: headers1 });
    
 
   
    this.loading.present();
    return new Promise((resolve, reject) => {
      this.http.post(Enums.APIURL.URL+'fetchnotificationupdateidx/'+userId+'/'+name+'/'+idx, options)
      .toPromise()
      .then((response) =>
      {
      
        console.log('API Response : ', response.json());
        // this.loading.dismiss();
        // this.comment=null;
        // this.getComments(this.comp.Idx);
        
        
        resolve(response.json());
      })
      .catch((error) =>
      {
        console.error('API Error : ', error.status);
        console.error('API Error : ', JSON.stringify(error));
        reject(error.json());
      });
    });

}



}
