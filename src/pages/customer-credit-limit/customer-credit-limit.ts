import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import { NativeStorage } from '@ionic-native/native-storage';
import * as Enums from '../../models/interfaces/enums';
import { Headers, RequestOptions } from '@angular/http';

/**
 * Generated class for the CustomerCreditLimitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-credit-limit',
  templateUrl: 'customer-credit-limit.html',
})
export class CustomerCreditLimitPage {
  termLimit: string;
  termRC: string;
  rmLY: string='0';
  rmCY: string;
  asoLY: string='0';
  asoCY: string;
  tertory: any;
  region: any;
  LitigationHistory: any;
  NoOfYearsWithBayer: any;
  customerNo: any;
  customerdetails: any;
  CustomerName: any;
  NoOfYearsInMarket: any;
  customers: any;
  asoIdx2: any;
  ports=[];
  port;
  selectedCustomer;
  constructor(public alert:AlertController,
     public loadingCtrl: LoadingController,
     private http: HttpInterceptor,
     private nativeStorage: NativeStorage,
     public navCtrl: NavController,
      public navParams: NavParams) 
      {
                               this.ports = [
                                    { id: 1, name: 'Tokai' },
                                    { id: 2, name: 'Vladivostok' },
                                    { id: 3, name: 'Navlakhi' }
                                  ];
                                  this.nativeStorage.getItem('EmpIDX2')
                                    .then(
                                      data => {
                                        console.log("URID from page sigin" + data);
                                        this.asoIdx2 = data;
                                        console.log(this.asoIdx2);
                                        this.getCustomers();
                                      },
                                      error => console.error(error)
                                    ); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerCreditLimitPage');
  }
  portChange(event: {
    component: SelectSearchableComponent,
    value: any 
}) {
  this.getCutomerDetails(this.selectedCustomer.Idx);
  // console.log(this.selectedCustomer.CustomerName);
//  console.log('port:', event.value);
}

  getCustomers(){
    let loder=this.loadingCtrl.create({
      spinner: 'dots',
    });
    loder.present();
    this.http.get(Enums.APIURL.URL+'fetchadminsalesordercustomer/'+this.asoIdx2).map(res => res.json()).subscribe(data => {
      var obj = JSON.parse(data);
      this.customers =obj ;  
      loder.dismiss();
      console.log(this.customers)},err=>{
        console.log(err);
        loder.dismiss();
        alert(err);
      });
  }

  getCutomerDetails(idx){
    let loder=this.loadingCtrl.create({
      spinner: 'dots',
    });
    loder.present();
    this.http.get(Enums.APIURL.URL+'getcustomerdetails/'+idx).map(res => res.json()).subscribe(data => {
      var obj = JSON.parse(data);
      this.customerdetails =obj ;  
      loder.dismiss();
      console.log(this.customerdetails)
      for(let c of this.customerdetails ){
        this.CustomerName= c.customerName
        this.customerNo=c.customerNo
        this.region=c.regionIdx
        this.tertory=c.territoryCode
        this.NoOfYearsInMarket=c.noOfYearsInMarket;
        this.NoOfYearsWithBayer=c.noOfYearsWithBayer;
        this.LitigationHistory=c.litigationHistory;
        // this.NoOfYearsInMarket=c.NoOfYearsInMarket
      }
    },err=>{
        console.log(err);
        loder.dismiss();
        alert(err);
      });
  }


  creditLimitInsert(){
    let loder=this.loadingCtrl.create({
      spinner: 'dots',
    });
    loder.present();
    let headers1 = new Headers({
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'});
      let options = new RequestOptions({ headers: headers1 }); 
      let data = JSON.stringify({
          "CreatedBy": this.asoIdx2,
          "ModifiedBy": "0",
          "AccountNumber": this.customerNo,
          "DealerShipName": this.CustomerName,
          "Region": this.region,
          "Territory": this.tertory,
          "NumberOfYearsInMarket": this.NoOfYearsInMarket,
          "NumberOfYearsWithBayer":this.NoOfYearsWithBayer,
          "LitigationHistory": this.LitigationHistory,
          "CustomerIdx": this.selectedCustomer.Idx,
          "WaitingIn": "" });
      return new Promise((resolve, reject) => {
        this.http.post(Enums.APIURL.URL+'creditlimitinsert', data, options)
        .toPromise()
        .then((response) =>{
          console.log('API Response : ', response.json());
          resolve(response.json());
          this.shortTermtHistoricalInfoInsert(response.json());
          this.proposedCreditLimitInsert(response.json());
         loder.dismiss();
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          loder.dismiss();
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
  }

  shortTermtHistoricalInfoInsert(CDIDX){
    let loder=this.loadingCtrl.create({
      spinner: 'dots',
    });
    loder.present();
    let headers1 = new Headers({
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'});
      let options = new RequestOptions({ headers: headers1 }); 
      let data = JSON.stringify({
        "CreditLmitIdx": CDIDX,
        "CreatedBy": this.asoIdx2,
        "ModifiedBy": "0",
        "ParticularIdx": "0",
        "Particulars": "1,2,3",
        "AsoCY": this.asoCY,
        "RmCY": this.rmCY,
        "AsoLY": this.asoLY,
        "RmLY": this.rmLY 

  //       "CreditLmitIdx": "0",
  // "CreatedBy": "0",
  // "ModifiedBy": "36565",
  // "ParticularIdx": "tetet",
  // "Particulars": "1",
  // "AsoCY": "1",
  // "RmCY": "0",
  // "AsoLY": "0",
  // "RmLY": "tes"
      });
      //http://webapps.a2zcreatorz.com/Bayer/DIS.svc/getcpbp/1017
      return new Promise((resolve, reject) => {
        this.http.post(Enums.APIURL.URL+'shorttermhistoryinsert', data, options)
        .toPromise()
        .then((response) =>{
          console.log('API Response : ', response.json());
          resolve(response.json());
         loder.dismiss();
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          loder.dismiss();
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
  }

  proposedCreditLimitInsert(CDIDX){
    let loder=this.loadingCtrl.create({
      spinner: 'dots',
    });
    loder.present();
    let headers1 = new Headers({
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'});
      let options = new RequestOptions({ headers: headers1 }); 
      let data = JSON.stringify({
        "CreditLimitIdx": "0",
        "CreatedBy": "0",
        "ModifiedBy": "36565",
        "TermRiskCategory": this.termRC,
        "TermLimit": this.termLimit,
        "LYSales": "1",
        "CPBP": "0",
        "MaxLimitRecommended": "0"      
      });
      return new Promise((resolve, reject) => {
        this.http.post(Enums.APIURL.URL+'proposedcreditlimitinsert', data, options)
        .toPromise()
        .then((response) =>{
          console.log('API Response : ', response.json());
          resolve(response.json());
         loder.dismiss();
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          loder.dismiss();
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
  }


}
