import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ActionSheetController, ToastController, Platform, Select, Content } from 'ionic-angular';
import * as Enums from '../../models/interfaces/enums';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import { HomePage } from '../home/home';
import { SalesPage } from '../sales/sales';

import { File } from '@ionic-native/file';
import { Base64 } from '@ionic-native/base64';
import { Camera } from '@ionic-native/camera';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import { CustAlert } from '../../providers/cust-alert/cust-alert';
import { SelectSearchableComponent } from 'ionic-select-searchable';
// import { AsoHomePage } from '../aso-home/aso-home';
/**
 * Generated class for the MakeNewOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var cordova: any;

@Component({
  selector: 'page-make-new-order',
  templateUrl: 'make-new-order.html',
})
export class MakeNewOrderPage {
  orderdata: any;
  @ViewChild('myInput') myInput: ElementRef;
  @ViewChild('select1') select1: Select;
  @ViewChild('inputBDS') InputBDS ;
  @ViewChild('inputBDSASO') InputBDSASO ;
  @ViewChild('inputAmount') InputAmount ;
  @ViewChild('inputAmountASO') InputAmountASO ;
  @ViewChild('selectbank') selectbank: Select;
  @ViewChild('myselect') selectComponent: SelectSearchableComponent;

  // @ViewChild('input') myInputt ;
  
  diee: any;
  // public event = {
  //   month: '2019-01-08',
   
  // }
 
  public rows: Array<{ firstCol: string, secondCol: string }> = [];
  public pdrows: Array<{ firstCol: string, secondCol: string }> = [];
  private maxQuantity: number = 5;
  

  credit:any;
  row=0;
  //rows=[1];
  userIDX:any;
  crtdbyIDX:any;
  remarks:any;
  orderNo:any;
  order:any;
  banks:any;
  bankId:any;
  payments:any;
  selectedBank=[]
  selectedType=[];
  bdsNo=[];
  amount=[];
  products:any;
  selectedPrdouct=[];
  quantity=[];
  orderidx:any;
  fixedAmount:any;
  date:any 
   minDate :any;
   day:any;
   month:any;
   year:any;
   maxdate:any;
   calValue=[];
   sumOfAmounts=0;
   procal=[];
   paymentype=[];
  // diee:any;
  loading:any;
  isAso:boolean=false;
  asoIdx2:any;
  customers:any;
  selectedCust:any;
  disablePayment:boolean=false;

  ////////attachment////
  imagebyte=[];
  imagePath=[];
  imagebyte2:any;
  imge:boolean=false;
  attach=[];
  // attach1:any;
  lastImage: string = null;
  ///end////
  imgIndex:any;
  hideaftersubmit: boolean = true;
empidxforseeds:any;

  constructor(private renderer: Renderer,public navCtrl: NavController,public alert:AlertController, public loadingCtrl: LoadingController, public navParams: NavParams,private http: HttpInterceptor,private nativeStorage: NativeStorage,public alertCtrl: AlertController, private base64: Base64, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform,private cusrtAlert:CustAlert) {

    this.isAso=this.navParams.get('Aso');
    
    
    //console.log('', this.paymentype);
    if(this.isAso){
      this.nativeStorage.getItem('EmpIDX2')
      .then(
      data => {
        console.log("URID from page sigin" + data);
        this.asoIdx2 = data;
        console.log(this.asoIdx2);
        this.empidxforseeds = this.asoIdx2;
        console.log('this.empidxforseeds '+this.empidxforseeds );
        this.getAllDetails();
       
      },
      error => console.error(error)
      ); 
    }else{
      this.empidxforseeds = 0;
      console.log('this.empidxforseeds '+this.empidxforseeds );
      this.nativeStorage.getItem('userID')
      .then(
      data => {
        console.log("URID from page sigin" + data);
        this.userIDX = data;
        console.log(this.userIDX);
        this.getAllDetails();
       
      },
      error => console.error(error)
      ); 
    }
   
    
    this.nativeStorage.getItem('crtdbyID')
    .then(
    data => {
      console.log("crtdID from page sigin" + data);
      this.crtdbyIDX = data;
     
    },
    error => console.error(error)
    );
  
    this.loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: `
        
        <div>Loading...</div>`,
     
    });

   console.log('userid',this.userIDX);
   console.log('crtdid',this.crtdbyIDX);
    this.date= new Date().toISOString();
    var mndate = new Date();
    // this.minDate = moment.utc().startOf('day').format('YYYY-MM-DD');
    // this.maxdate = moment.utc().add(1, 'y').format('YYYY-MM-DD');
    this.minDate=mndate.setDate(mndate.getDate() - 1).toString();
    
    this.maxdate=mndate.setDate(mndate.getFullYear() +10).toString();
    // this.maxdate.toISOString();
    // this.minDate.toISOString();
    // this.day= new Date().getDate()-1;
    // this.month=new Date().getMonth();
    // this.year=new Date().getFullYear();
    // console.log(this.date);
    
    //this.minDate = this.year + "-" + this.month + "-" + this.day
    //this.date = this.year + "-" + this.month + "-" + this.date
    
   // this.minDate=this.date;
    console.log(this.minDate);

    this.rows.push({ firstCol: '1 of 2', secondCol: '2 of 2' });//leave it
    this.pdrows.push({ firstCol: '1 of 2', secondCol: '2 of 2' });//leave it
    
   

  }
  public addrow(): void {
    this.rows.push({ firstCol: '1 of 2', secondCol: '2 of 2' });
  }
  public pdaddrow(): void {
    this.pdrows.push({ firstCol: '1 of 2', secondCol: '2 of 2' });
  }
  

SelectedPT(i:number){
  console.log('::::::');
if(i==0){
  setTimeout(() => {
    if(this.paymentype[i] === 1)
    this.InputBDSASO.nativeElement.setFocus();
    // this.renderer.invokeElementMethod(this.InputBDSASO.nativeElement, 'focus');
    else
    this.InputBDS.nativeElement.setFocus();
    // this.renderer.invokeElementMethod(this.InputBDS.nativeElement, 'focus');
  },500);
  
}
}
onClose() {
  console.log( this.selectedCust.Idx);
  this.getCrditBySelectedCust();
  let toast = this.toastCtrl.create({
    message: 'Thanks for your selection',
    duration: 2000
  });
  toast.present();
}
portChange(event: {
  component: SelectSearchableComponent,
  value: any 
}) {

  console.log('port:', event.value);}
SelectedBankChan(i:number){
  console.log('///////');
  if(i==0){
    setTimeout(() => {
      if(this.paymentype[i] === 1)
      this.InputAmount.setFocus();
      else
      this.InputAmountASO.setFocus();
    },150);
  }
  }
eventHandlerBDS(keyCode) {
 if(keyCode==13 ){
  this.selectbank.open();
 }
}
eventHandlerAmount(keyCode,ind) {
  if(keyCode==13 ){
    this.presentActionSheet(ind);
  }
 }
//   openSelect(index: number) {
//     console.log("Number Requested"+index);
//     let element: ElementRef = this.content.getNativeElement();
  
    
//     let select = element.nativeElement('#select'+index);
//     select.click(); 
//     console.log("****************");
//     console.log("Number Selected"+index);
//     console.log(select);
//     console.log("****************");
// }
// myFunction() {
//   document.getElementById("myDropdown").classList.toggle("show");
// }
filterFunction() {
console.log('clicked');
  var input, filter, ul, li, a, i,option;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  var div = document.getElementById("myDropdown");
  option = div.getElementsByTagName("option");
  for (i = 0; i < option.length; i++) {
      if (option[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
        option[i].style.display = "";
      } else {
        option[i].style.display = "none";
      }
  }
}
  ionViewDidLoad() {
//  this.openSelect(0);
    
    if(this.isAso){
      this.select1.close();
    }else{
      this.select1.open();
    }
    // setTimeout(() =;> {
    //   this.myInputt.setFocus();
    // },150);
    console.log('ionViewDidLoad MakeNewOrderPage');
  }
  resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
}
 ff = 0;
// addrow(){
//   console.log('row clicked');

//   // this.row=this.row=+1
// this.ff++;

// this.rows[1]=this.ff++;;
// console.log(this.ff);
//   this.row+=1;
//    //this.rows[1]=this.row++;
//   // this.rows.add(1);

//   console.log(this.rows);
// }
sumAllAmounts(){
  this.sumOfAmounts=0;
  for(var i=0;i<this.amount.length;i++){
    this.sumOfAmounts = +this.sumOfAmounts + +this.amount[i];
  }
  console.log(this.sumOfAmounts);
}
  getAllDetails(){
/////////orderno://///////
this.loading.present();
   
        /////////Banks://///////
        this.http.get(Enums.APIURL.URL+'fetchbank').map(res => res.json()).subscribe(data => {
          // debugger;
           var obj = JSON.parse(data);
          
           this.banks = obj; 
          console.log(this.banks[0])
       
             console.log(this.banks[0].Bankname+":"+this.banks[0].idx);
          
        
            });


        /////////PaymentsTypes://///////
        this.http.get(Enums.APIURL.URL+'fetchpaymenttype').map(res => res.json()).subscribe(data => {
          // debugger;
           var obj = JSON.parse(data);
          
          this.payments = obj; 
          console.log(this.order)
            //  this.orderNo= payment[0].orderNo;
              console.log(this.payments[0]);
            
        
            });/////end payments
////////////////////products//////////
             this.http.get(Enums.APIURL.URL+'fetchproducts').map(res => res.json()).subscribe(data => {
             // this.http.get(Enums.APIURL.URL+'fetchproductsforemployee/'+this.empidxforseeds).map(res => res.json()).subscribe(data => {
              // debugger;
               var obj = JSON.parse(data);
              this.products = obj; 
              console.log(this.order)
                //  this.orderNo= payment[0].orderNo;
                  console.log(this.products[0].idx);
                  this.loading.dismiss();

                });/////end products
                /////////Fixed amount by bayer////

                this.http.get(Enums.APIURL.URL+'fetchsalesorderamountcheck').map(res => res.json()).subscribe(data => {
                  // debugger;
                   var obj = JSON.parse(data);
                  this.fixedAmount = Number(obj[0].amount) ; 
                  console.log(this.fixedAmount)
                    });/////end Fixed amount by bayer

                     /////////credit active or not////
                  if(this.isAso){
                    // this.selectedCust=true;
                    //do nothing
                  }else{
                    this.http.get(Enums.APIURL.URL+'fetchcheckcreditlimit/'+this.userIDX).map(res => res.json()).subscribe(data => {
                      // debugger;
                       var obj = JSON.parse(data);
                      this.credit =obj ; 
                      console.log(this.credit)
                      if(this.credit === true){
                        this.paymentype[0] = 1;
                      }else{
                        this.paymentype[0] = 0;
                      }
                        });/////endcredit active or not
                  }
            

                    //if isAso then fetch custumerss
                    if(this.isAso){
                      this.http.get(Enums.APIURL.URL+'fetchadminsalesordercustomer/'+this.asoIdx2).map(res => res.json()).subscribe(data => {
                        // debugger;
                         var obj = JSON.parse(data);
                        this.customers =obj ; 
                        
                        console.log(this.customers[0].Idx)
                        
                        setTimeout(() => {
                          this.select1.open();
                        },100);
                        
                          });
                    }
    

  }

  getCrditBySelectedCust(){//for aso
    console.log('changed.');
  
   let loder= this.loadingCtrl.create({
      content: 'getting credit limit...',
    });
    loder.present();
    this.http.get(Enums.APIURL.URL+'fetchcheckcreditlimit/'+this.selectedCust.Idx).map(res => res.json()).subscribe(data => {
      // debugger;
       var obj = JSON.parse(data);
       loder.dismiss();
      this.credit =obj ; 
      console.log(this.credit)
      if(this.credit === true){
        this.paymentype[0] = 1;
      }else{
        this.paymentype[0] = 0;
      }
        });/////endcredit active or not
  }//for aso

  insertOrderdetails(){
    console.log('in insertmthd');
    this.uploadAllFiles().then((x=>{
      console.log('then uplodin insetmthd');

      if(x){
          if( this.selectedType[0] === "" || this.selectedBank[0] === "" || this.selectedPrdouct[0] === "" || this.selectedType[0] === "" || this.quantity[0] ===""){
            this.cusrtAlert.presentAlert('Bayer','Please fill all the inputs properly !');
            
          }else{
            this.http.get(Enums.APIURL.URL+'fetchsalesorderno').map(res => res.json()).subscribe(data => {
              // debugger;
               var obj = JSON.parse(data);
              // alert(obj[0].userName);
              this.order = obj; 
              console.log(this.order)
                 this.orderNo= this.order[0].orderNo;
                 console.log(this.orderNo);
                //  console.log;
            this.SubmitProducts();
                },
              Error=>{
                this.cusrtAlert.presentAlert("Error!","Some Error Occured.");
              });
                }
                
              // });///newprom
              }else{
                this.cusrtAlert.presentAlert("Error!","File upload error.");
              }
            }));
            }//methd ends



   SubmitProducts(){
    if(this.isAso){
      this.orderdata = JSON.stringify(
        {
          "OrderNo":this.orderNo,
          "OrderJsonDate":this.date,
          "CreatedBy":this.crtdbyIDX,
          "CustomerIdx" :this.selectedCust.Idx,
          "OrderAmount" : this.sumOfAmounts,
          "Remarks":this.remarks,
          "Status" : "In Process",
          "EmpIdx" : this.asoIdx2
          
        });
        console.log('if', this.orderdata);
      }else{
        this.orderdata = JSON.stringify(
          {
            "OrderNo":this.orderNo,
            "OrderJsonDate":this.date,
            "CreatedBy":this.crtdbyIDX,
            "CustomerIdx" :this.userIDX,
            "OrderAmount" : this.sumOfAmounts,
            "Remarks":this.remarks,
            "Status" : "In Process",
            "EmpIdx" : 0
            
          });
          console.log('else', this.orderdata);
        }
        
        
        console.log(this.selectedBank+"\n"+this.selectedType+"\n"+this.bdsNo+"\n"+this.amount);
        let headers1 = new Headers(
          {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
          });
          
          
          let options = new RequestOptions({ headers: headers1 });
          
          
          
          
          return new Promise((resolve, reject) => {
            this.http.post(Enums.APIURL.URL+'savesalesordernojson',  this.orderdata, options)
            .toPromise()
            .then((response) =>
            {
              // var res=  response;
              
              // this.orderidx=res[0].Idx;
              // console.log(this.orderidx);
              console.log('API Response : ', response.json());
              this.insertAllPayments(response.json());//insert payements by order idx
              this.insertAllProducts(response.json());//insert products by idx
             // loadingg.dismiss();
              //////ordersubmitted///pushing to home
              this.loading.dismissAll();
              this.cusrtAlert.presentAlert('Bayer','Your order have sent to Bayer.\n Order No '+this.orderNo);
              if(this.isAso){
                this.navCtrl.setRoot("AsoHomePage");
              }else{
                this.navCtrl.setRoot(HomePage);
              }

              resolve(response.json());
             // resolvee(true);
            })
            .catch((error) =>
            {
              console.error('API Error : ', error.status);
              console.error('API Error : ', JSON.stringify(error));
              reject(error.json());
            });
          });
   }         
  insertAllProducts(idx:string){//just for multiple products
            var ss = 0;
            ss= this.pdrows.length;
                for(var i=0;i<ss;i++){
                 // debugger;
                  this.insertProducts(idx,i);
                  console.log("Index"+i);
                }

                
  }
  insertAllPayments(idx:string){
    console.log('order Idx:',idx);
    var ss = 0;
    ss= this.rows.length;
        for(var i=0;i<ss;i++){
          if(this.attach[i] === undefined){
            this.attach[i]="-";
          }
         // debugger;
          this.insertPayments(idx,i);
          console.log("Index"+i);
        }
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
          "Quantity":this.quantity[i],
          "CreatedBy":this.crtdbyIDX,
          "SalesOrderIdx":idx,
          "ProductCode": this.selectedPrdouct[i].split('-')[0],
          "ValueCal":this.calValue[i],
          "PackIdx": this.selectedPrdouct[i].split('-')[1]
          
          
     });
      console.log('pack',this.selectedPrdouct[i].split('-')[1]);
      console.log('idx',this.selectedPrdouct[i].split('-')[0]);

      this.loading.present();
      return new Promise((resolve, reject) => {
        this.http.post(Enums.APIURL.URL+'saveproductdetailsforsalesorder', data, options)
        .toPromise()
        .then((response) =>
        {
        
          console.log('API Response : ', response.json());
          resolve(response.json());
          this.loading.dismiss()
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
      
    
     
  }
  insertPayments(idx:string, i:number){
    // let loadingg = this.loadingCtrl.create({
    //   content: 'Uploading...',
    // });
    // loadingg.present();
    let headers1 = new Headers(
      {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      });
   
 
      let options = new RequestOptions({ headers: headers1 });
      
      var dataa = '{"orderNo":"4547","orderDate":"26/01/2018","createdBy":"1","customerIdx":"1017","orderAmount":"20000","Remarks":"comments goes here","Status":"In Process"}';
       /*"{\"orderNo\":\"1001\",\"orderDate\":\"26/01/2018\"}" */ 
      
       let data = JSON.stringify(
        {
          "DocNo":this.bdsNo[i],
          "CreatedBy":this.userIDX,
          "SalesOrderIdx":idx,
          "Amount":this.amount[i],
          "BankName":this.selectedBank[i],
          "PaymentType":this.selectedType[i],
          "Attachment": this.attach[i]
          
     });
      
      return new Promise((resolve, reject) => {
        this.http.post(Enums.APIURL.URL+'savebankdetailsforsalesorder', data, options)
        .toPromise()
        .then((response) =>
        {
          console.log('API Response : ', response.json());
          resolve(response.json());
          // loadingg.dismiss();
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });

    
  }
    chekAmount(){
      console.log(this.amount,this.fixedAmount,'chk');
    
        if(this.sumOfAmounts<this.fixedAmount-1){
          this.cusrtAlert.presentAlert('Bayer','Your amount should be greater then: '+this.fixedAmount)
        }else{
  
        
      }
     
    }

  chkData() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait',
    });
    this.loading.present();

    this.hideaftersubmit = false;
    var alrt = false;
    console.log(this.rows.length);
    if (this.pdrows.length > 0 && this.rows.length > 0) {
      console.log('first if');
      for (var i = 0; i <= this.rows.length - 1; i++) {

        if (this.selectedBank[i] === undefined && this.credit === true) {
          console.log('2nd if');
          this.selectedBank[i] = "-";
          this.bdsNo[i] = "-";
          this.amount[i] = "-";

        } else { }

        console.log(this.selectedType[i]);
        if ( this.selectedType[i] === undefined || this.selectedBank[i] === undefined || this.bdsNo[i] === undefined || this.amount[i] === undefined) {
          console.log('3rd if');
          alrt = true;
        } else {
          console.log('3rdelse');
          alrt = false;
        }


      }
      if (alrt == false) {
        console.log('4th if');
        for (var i = 0; i <= this.pdrows.length - 1; i++) {
 
          console.log(this.selectedType[i]);
          if (this.selectedPrdouct[i] === undefined || this.quantity[i] === undefined) {
            console.log('4th if');
            alrt = true;
          } else {
            alrt = false;         console.log('4th if');
          }


        }
      }
    } else {
      console.log('4th if');
      alrt = true;
    }
    if (alrt) {
      console.log('4th if');
      this.cusrtAlert.presentAlert('Bayer', 'Please fill all the inputs properly!');
    } else {
      console.log('insert methd strt' );
      if(this.isAso){
        if(this.selectedCust == undefined){
          this.cusrtAlert.presentAlert('Bayer', 'You must select a customer !');
        }else{
          this.insertOrderdetails()
        }

      }else{

        this.insertOrderdetails()
      }
     
      // .then((x)=>{
      //   if(x){


    }
    //   });

    // }
    this.hideaftersubmit = true;
  }
    splicerow(x:string,index:number){
      console.log(x,index);
      if(x==='pdrows'){
        this.pdrows.splice(index,1);
        this.quantity.splice(index,1);
        this.selectedPrdouct.splice(index,1);

      }else{
        this.rows.splice(index,1);
        this.amount.splice(index,1);
        this.selectedType.splice(index,1);
        this.selectedBank.splice(index,1);
        this.bdsNo.splice(index,1);
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
            this.splicerow('pdrows',index);
            this.cusrtAlert.presentAlert('Duplicates','Product should not be duplicate.');
          }

          }
      }
    }

    calXquntity(index:number){
      this.removeDuplicate(index);
      var p=this.selectedPrdouct[index];
      var i_cal;
      console.log(p,'product');
      for(var i=0;i<this.products.length;i++){
          if(this.products[i].idx==p){
            console.log(this.products[i].idx,'IDX','I :',i);
            i_cal=this.products[i].calValue;
            this.procal[index]=i_cal;
            console.log(this.products[i].calValue,"cal:",i_cal,"VALUE:",this.products[i].calValue);
          }
      }
      this.calValue[index]=i_cal*this.quantity[index]
      console.log(this.calValue[index]);
      
    }

    PaymentType(i:number){
     
      console.log('log');
      // for(var i=0;i<this.selectedType.length;i++){
          var type=this.selectedType[i]
          console.log(type);
          if(type=== undefined || type ==="Credit"){

            this.paymentype[i] = 1;
            console.log(this.paymentype);
          }else{
            this.paymentype[i] = 0;
            console.log(this.paymentype);
          }

      // }
      this.SelectedPT(i)
    }
 
   
    ///////imges///


    public presentActionSheet(index:any) {
      this.imgIndex=index;
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Select Image Source',
        buttons: [
          {
            text: 'Load from Library',
            handler: () => {
              this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
            }
          },
          {
            text: 'Use Camera',
            handler: () => {
              this.takePicture(this.camera.PictureSourceType.CAMERA);
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      });
      actionSheet.present();
    }
  
  
    public takePicture(sourceType) {
      // Create options for the Camera Dialog
      var options = {
        quality: 100,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };
  
      // Get the data of an image
      this.camera.getPicture(options).then((imagePath) => {
        // Special handling for Android library
        if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          this.filePath.resolveNativePath(imagePath)
  
            .then(filePath => {
              console.log('img:',imagePath);
              console.log('path:',filePath);
              // this.converttobase(filePath);
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            });
        } else {
          console.log('cemra');
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          console.log(correctPath);
          console.log(currentName);
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        }
      }, (err) => {
        this.presentToast('Error while selecting image.');
      });
    }
  
  
  
    // Create a new name for the image
    private createFileName() {
      var d = new Date(),
        n = d.getTime(),
        newFileName = n + ".jpg";
      return newFileName;
    }
  
    // Copy the image to a local folder
    private copyFileToLocalDir(namePath, currentName, newFileName) {
      this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
        this.lastImage = newFileName;
        this.imagePath[this.imgIndex]=this.lastImage;
        this.converttobase(this.pathForImage(this.lastImage));
          console.log('imgPath',this.imagePath[this.imgIndex]);
        console.log(this.lastImage);
       
      }, error => {
        this.presentToast('Error while storing file.');
      });
    }
  
    private presentToast(text) {
      let toast = this.toastCtrl.create({
        message: text,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  
    // Always get the accurate path to your apps folder
    public pathForImage(img) {
      if (img === null) {
        return '';
      } else {
        return cordova.file.dataDirectory + img;
      }
    }
  
    public uploadImage() {
      // Destination URL
      var url = Enums.APIURL.URL+"SavePng";
  
      // File for Upload
      var targetPath = this.pathForImage(this.lastImage);
  
      // File name only
      var filename = this.lastImage;
  
      var options = {
        fileKey: "file",
        fileName: "file",
        chunkedMode: false,
        mimeType: "multipart/form-data",
        params: { 'fileName': "file" }
      };
  
      const fileTransfer: TransferObject = this.transfer.create();
  
      // this.loading = this.loadingCtrl.create({
      //   content: 'Uploading...',
      // });
      // this.loading.present();
  
      // Use the FileTransfer to upload the image
      fileTransfer.upload(targetPath, url, options).then(data => {
        this.loading.dismissAll()
        this.presentToast('Image succesful uploaded.');
      }, err => {
        this.loading.dismissAll()
        this.presentToast('Error while uploading file.');
      });
    }
    pageTwo() {
      this.navCtrl.push('PageTwoPage');
    }
  
    converttobase(path) {
      console.log('converting');
      // let filePath: string = 'file:///...';
      let loadingg = this.loadingCtrl.create({
        content: 'wait please...',
      });
      loadingg.present();
      this.base64.encodeFile(path).then((base64File: string) => {
        // if(this.imagebyte === undefined){
          var img = base64File;
          var imgg2 = img.split("base64,");
          this.imagebyte[this.imgIndex]=imgg2[1];
          console.log('base:',this.imagebyte[this.imgIndex],this.imgIndex);
          
          loadingg.dismiss();
        // }else {
        //   this.imagebyte2=base64File;
        //   console.log('base:',this.imagebyte2);
        // }
        
       
      }, (err) => {
        console.log(err);
      });
    }
  
    uploadString(i){
      return new Promise((ress=>{

        let loadingg = this.loadingCtrl.create({
          content: 'Uploading...',
        });
        loadingg.present();
        
        var url = Enums.APIURL.URL+"SavePng";
        let headers1 = new Headers(
          {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
          });
          
          
          let options = new RequestOptions({ headers: headers1 });
          
          
          
          let data = JSON.stringify(
            {
              
              Name:this.imagebyte[i]
              
              
            });
            
            //  console.log(data);
            
            return new Promise((resolve, reject) => {
              this.http.post(url,data, options)
              .toPromise()
              .then((response) =>
              {
                
                console.log('API Response : ', response.json());
                this.attach[i] = response.json();
                loadingg.dismiss();
                resolve(response.json());
                console.log('uplodimg:',this.imagebyte.length,'i:',i);
                if(i===this.imagebyte.length-1){
                  ress(true);
                }
                
              })
              .catch((error) =>
              {
                console.error('API Error : ', error.status);
                console.error('API Error : ', JSON.stringify(error));
                reject(error.json());
                loadingg.dismiss();
                ress(false);
              });
            });
          }));
    }

    uploadAllFiles(){
      console.log('uplodfiles');
      return new Promise((resolve=>{
        if(this.imagebyte[0] != undefined){
          console.log(this.imagebyte,'this.imagebyte != undefined');
          console.log('img:',this.imagebyte.length);
          for(var i =0; i<this.imagebyte.length;i++){
            this.uploadString(i).then((x=>{
              console.log('img:',this.imagebyte.length,'i:',i);
              if(x){
                console.log("x:",x);
                if(i === this.imagebyte.length){
                  resolve(true);
                  console.log("if resolve:",x);
                  
                }
              }else{
                this.cusrtAlert.presentAlert('Upload error','check your network strength');
              }
            }));
           
          }
            }else{
              console.log('else uplod')
              resolve(true);
            }

      }));
    }
    showImg(image){
      let alert = this.alert.create({
        // title: 'Image',
        message: '<div> <img width="200px" height="auto" src="'+image+'" > </div>',
        buttons: ['Close']
      });
      alert.present();
  
    }

    GetProductpkidx(pIdx):any{
      let temppkIdx:any=0;
      //  console.log("Products are: "+JSON.stringify(this.products));
      for(let pro of this.products)
        {
            if(pro.idx==pIdx){
              temppkIdx=pro.packIdx;
            }
        }
        return temppkIdx;
    }
    
}
