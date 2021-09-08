import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events, ToastController, LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import { Http, Headers, RequestOptions } from '@angular/http';

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import * as Enums from '../../models/interfaces/enums';

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  req: any;
  response: any;
  desi: any;
  idx: any;
  type: any;
  remarks="";
  application="No";
  physicalLoc="No";
  shopboard="No";
  Deviation="-";
  constructor( public loadingCtrl: LoadingController, private http: HttpInterceptor,public nativeStorage:NativeStorage ,public toastCtrl:ToastController ,public events: Events,public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams) {
  this.type=this.navParams.get('TYPE');
  this.desi=this.navParams.get('DESI');
  this.idx=this.navParams.get('IDX');
  this.req=this.navParams.get('REQ');
  console.log('PAGE LOAD:' +this.req );
  // this.type=this.navParams.get('TYPE');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalPage');
  }
  submit() {
    if(this.type =="reject"){
      if(this.remarks ==""){
        this.toast('You Must Add Remaks');

        
        
      }else{
        // this.save(this.remarks,this.type);
        this.aproveReject(this.type);
        this.events.publish('remarks:type',this.remarks,this.type);
        this.viewCtrl.dismiss();
       
      }
       
    }else{
      if(this.remarks ==""){
        this.toast('You Must Add Remaks');
    
      }else{

        this.aproveReject(this.type);
        // this.save(this.remarks,this.type);
        this.events.publish('remarks:type',this.remarks,this.type);
        this.viewCtrl.dismiss();

      }
    
    }
   
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
  toast(msg) {
    let toast = this.toastCtrl.create({
      message: '' + msg,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
  save(remarks,type){
    this.nativeStorage.setItem('remarks', {remarks:remarks , type: type})
  .then(
    () => console.log('Stored remarks!'),
    error => console.error('Error storing remarks', error)
  );
  }
  aproveReject(type) {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      enableBackdropDismiss: true

    });
    loader.present();
    // ====================this update is done by taimoor on 10-05-2019 ==============
    var formatedremarks= this.remarks.replace(/'/g,'');

    let headers1 = new Headers(
      {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      });

      let options = new RequestOptions({ headers: headers1 });

    
      
let data =JSON.stringify(
  {
    "customeridx":this.req,
    "type" :type,
    "designationidx" : this.desi,
     "empidx":this.idx ,
     "remarks":formatedremarks
    });

    console.log(data);
    return new Promise((resolve, reject) => {
      this.http.post(Enums.APIURL.URL+'approverejectcustomerrequest', data, options)
      .toPromise()
      .then((response) =>
      {
        console.log('API Response : ', response.json());
        //resolve(response.json());
       // var res=JSON.parse(response.json());
        var obj = response.json();
      this.response = obj;
      console.log('Response this.response : ', this.response );
      this.ensureRsm();
      if (this.response == "done") {
        this.toast('You ' + type + ' the customer for Bayer.');
        loader.dismiss();
      }
        
      })
      .catch((error) =>
      {
        console.error('API Error : ', error.status);
        console.error('API Error : ', JSON.stringify(error));
        reject(error.json());
        loader.dismiss();
      });
    });

// ====================this update is done by taimoor on 10-05-2019 ==============
    // this.http.get(Enums.APIURL.URL + 'approverejectcustomerrequest/' +this.req+ "/" + type + "/" +this.desi + "/" + this.idx + "/" +formatedremarks).map(res => res.json()).subscribe(data => {

    //   // console.log(Enums.APIURL.URL + 'approverejectcustomerrequest/' + this.req.idx + "/" + type + "/" + this.user[0].designationIdx + "/" + this.user[0].idx2);
    //   var obj = data;
    //   this.response = obj;
    //   this.ensureRsm();
    //   if (this.response == "done") {
    //     this.toast('You ' + type + ' the customer for Bayer.');
      
    //   }
    //   console.log("RESPONCE ==" +this.response);
    //   loader.dismiss();
    // }, err => {
    //   loader.dismiss();
    //   this.toast('Error:' + err);
    //   console.log(err);
    // });
  }
  ensureRsm(){


    var formatedDeviation= this.Deviation.replace(/'/g,'');

    this.http.get(Enums.APIURL.URL + 'rsmverification/' +this.req+ "/" + this.application + "/" +this.physicalLoc + "/" + this.shopboard+ "/" + formatedDeviation).map(res => res.json()).subscribe(data => {
      // console.log(Enums.APIURL.URL + 'approverejectcustomerrequest/' + this.req.idx + "/" + type + "/" + this.user[0].designationIdx + "/" + this.user[0].idx2);
      var obj = data;
    }, err => {

      console.log(err);
    });
  }


}
