import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import * as Enums from '../../models/interfaces/enums';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { HomePage } from '../home/home';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import { CustAlert } from '../../providers/cust-alert/cust-alert';
/**
 * Generated class for the MakeStockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-make-stock',
  templateUrl: 'make-stock.html',
})
export class MakeStockPage {

  date:any;
  mindate:any;
  maxdate:any;
  stockidx: any;
  userId: any;
  userIDX: any;
  products: any;
  selectedPrdouct=[];
  quantity=[];
  public rows: Array<{ firstCol: string, secondCol: string }> = [];
  public pdrows: Array<{ firstCol: string, secondCol: string }> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,private http: HttpInterceptor,private nativeStorage: NativeStorage,private custAlert:CustAlert) {
    this.date= new Date().toISOString()
    this.SetDateTimeLimitaion();
 
    this.getAllProducts();

    this.nativeStorage.getItem('userID')//userid
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.userId = data;
      console.log("User Id:" + this.userId);
      // this.getCompleted(this.userId);
    });


    this.rows.push({ firstCol: '1 of 2', secondCol: '2 of 2' });//leave it
    this.pdrows.push({ firstCol: '1 of 2', secondCol: '2 of 2' });//leave it
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MakeStockPage');
  }
  public addrow(): void {
    this.rows.push({ firstCol: '1 of 2', secondCol: '2 of 2' });
  }
  public pdaddrow(): void {
    this.pdrows.push({ firstCol: '1 of 2', secondCol: '2 of 2' });
  }
  splicerow(index:number){
      console.log(index);
      console.log("Request for Deleting"+index);
      console.log("Arrays");
      console.log(this.pdrows);
      console.log(this.selectedPrdouct);
      console.log(this.rows);
      this.pdrows.splice(index,1);
      this.quantity.splice(index,1);
      this.selectedPrdouct.splice(index,1);
      this.rows.splice(index,1);
  }


  getAllProducts(){
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      
    });
    loader.present();
    this.http.get(Enums.APIURL.URL+'fetchproducts').map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
      this.products = obj; 
      // console.log(this.order)
        //  this.orderNo= payment[0].orderNo;
        console.log("Fething Products");
        console.log(this.products);
          console.log(this.products[0].idx);
          loader.dismiss();

        },err => {
          console.log(err);
          loader.dismiss();
        });/////end products
  }


  ChekIFnull(){
    console.log("insrt4",this.quantity[0]);
    for(var i=0;i<this.rows.length;i++){
      // console.log("insrt5",this.quantity[0]);
      // console.log(this.selectedPrdouct[i] != undefined);
      // console.log(this.quantity[i] != undefined );
      // console.log(this.quantity[i] != 'undefined' );
      // console.log(this.selectedPrdouct[i] != "undefined");
      // console.log("insrt6",this.quantity[0]);
      // console.log("quntity",this.quantity[i]);
      // console.log("p",this.selectedPrdouct[i])
      // console.log("i",i);
     // console.log(this.products[i] != undefined && this.quantity[1]!=undefined  this.products[i] != "undefined" && this.quantity[1]!="undefined");
      if(this.products[i] == undefined || this.quantity[i] == undefined  ){
        console.log("!done");
        this.custAlert.presentAlert('Error','Please fill all the feilds.');
         
      }else{
        
        this.insertProducts(this.userId,i);
        console.log("done");
      }
    }
  }
  removeDuplicate(index:number){
    var p=this.selectedPrdouct[index];
    var i_cal;
    console.log(p,'product');
    for(var i=0;i<this.pdrows.length;i++){
      if(index==i){
        console.log(index,i)
      }else{
        console.log(index,i)
        if(this.selectedPrdouct[i]==p){
          // this.selectedPrdouct[index]=undefined
          this.splicerow(index);
          this.custAlert.presentAlert('Duplicates','Product should not be duplicate.');
        }

        }
    }
  }
  chkifStok(){
    console.log("chifstock");
    let send=false;
    for(var i=0;i<this.rows.length;i++){
      
     // console.log(this.products[i] != undefined && this.quantity[1]!=undefined  this.products[i] != "undefined" && this.quantity[1]!="undefined");
      if(this.products[i] == undefined || this.quantity[i] == undefined  ){
        console.log("!done");
        send=false;
        this.custAlert.presentAlert('Error','Please fill all the feilds.');
         
      }else{
        send=true;
      
      }
    }
    if(send){
      this.insertStock();
      console.log("done");
    }
  }
  chkQ(){
   console.log(this.quantity[0]);
  //  console.log(this.quantity[1]);
 }
  insertProducts(idx:string, i:number){

    let headers1 = new Headers(
      {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      });

      let options = new RequestOptions({ headers: headers1 });

      // var dataa = '{"orderNo":"4547","orderDate":"26/01/2018","createdBy":"1","customerIdx":"1017","orderAmount":"20000","Remarks":"comments goes here","Status":"In Process"}';
       /*"{\"orderNo\":\"1001\",\"orderDate\":\"26/01/2018\"}" */ 
       
       let data = JSON.stringify(
        {
        "ProductIdx":this.selectedPrdouct[i].split('-')[0],
        "Packidx":this.selectedPrdouct[i].split('-')[1],
        "Quantity" : this.quantity[i],
        "CustomerStockIdx" : this.stockidx,
        "Remarks":"-"}
      );
      console.log(this.selectedPrdouct[i]);
      console.log(data);

      // this.loading.present();
      return new Promise((resolve, reject) => {
        this.http.post(Enums.APIURL.URL+'savecustomerstockproduct', data, options)
        .toPromise()
        .then((response) =>
        {
          console.log('API Response : ', response.json());
          resolve(response.json());
          
          if(i === this.rows.length-1){
            console.log(i,':',this.rows.length-1);
            this.custAlert.presentAlert('Bayer','Stock Entry sent to Bayer');
            // this.navCtrl.push(HomePage);
            this.navCtrl.pop();
          }
          // this.loading.dismiss()
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      }); 
  }

  insertStock(){
console.log("insrt",this.quantity[0]);
    let headers1 = new Headers(
      {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      });


      let options = new RequestOptions({ headers: headers1 });


     
      
      // var dataa = '{"orderNo":"4547","orderDate":"26/01/2018","createdBy":"1","customerIdx":"1017","orderAmount":"20000","Remarks":"comments goes here","Status":"In Process"}';
       /*"{\"orderNo\":\"1001\",\"orderDate\":\"26/01/2018\"}" */ 
       
       let data = JSON.stringify(
        {
        "CustomerIdx":this.userId,
        "TerritoryIdx" : "0",
        "RegionIdx" : "0", 
        "Date":this.GetDateOnlyString(this.date),
        "Remarks" : "Show Details",
        "Visible" : "1" }
      );
      console.log(data);
      // console.log(this.selectedPrdouct[i])
      console.log("insrt1",this.quantity[0]);
      // this.loading.present();
      return new Promise((resolve, reject) => {
        this.http.post(Enums.APIURL.URL+'SaveCustomerStockReport', data, options)
        .toPromise()
        .then((response) =>
        {
        
          console.log('API Response : ', response.json(),":::::",);       
          // resolve(response.json());
          this.stockidx = response.json();
          console.log("insrt2",this.quantity[0]);
          this.ChekIFnull();
          console.log("insrt3",this.quantity[0]);
         console.log("Customer stock IDX:"+this.stockidx);
          // this.loading.dismiss()
        })
        .catch((error) =>
        {
          this.custAlert.presentAlert('Error','Please fill all the feilds.');
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
  }


  SetDateTimeLimitaion(){
    let checkDate=new Date();
    // console.log(checkDate);
    // console.log("Year:"+checkDate.getUTCFullYear());
    // console.log("Month:"+checkDate.getMonth());
    // console.log("Day:"+checkDate.getUTCDate());

    if(checkDate.getUTCDate()>=6){
      // console.log("Greator then 5 :"+checkDate.getDay());
      let tempDate=new Date(this.date);
      this.mindate=new Date(tempDate.setDate(1)).toISOString();
      this.maxdate=new Date().toISOString();
    }else{
      // console.log("Less then 5 :"+checkDate.getDay());
      let tempDate=new Date();
      this.mindate=new Date(tempDate.getFullYear(),tempDate.getMonth()-1,2).toISOString();
      this.maxdate=new Date().toISOString();
    }
    console.log("Min: "+this.mindate);
    console.log("Max: "+this.maxdate);
  }

  GetProductidx(pkId):any{
    let tempIdx:any=0;
    //  console.log("Products are: "+JSON.stringify(this.products));
    for(let pro of this.products)
      {
          if(pro.packIdx==pkId){
            tempIdx=pro.idx;
          }
      }
      return tempIdx;
  }

GetDateOnlyString(dt):string{
  var tempdate=new Date(dt);
  var year = tempdate.getUTCFullYear() + "";
  var month = (tempdate.getUTCMonth() + 1) + "";
  var day = tempdate.getDate() + "";
 
 try{
  if(parseInt(month) > 9){
    return  day + "/" + month + "/" + year;
  }else{
    return  day + "/" +'0'+ month + "/" + year;
  }
 }catch(e){
  return  day + "/" + month + "/" + year;
 } 
 
}
}
