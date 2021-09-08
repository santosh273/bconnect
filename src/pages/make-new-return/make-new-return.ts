import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, ToastController, Platform, LoadingController } from 'ionic-angular';
import { Http, RequestOptions,Headers } from '@angular/http';
import * as Enums from '../../models/interfaces/enums';
import { NativeStorage } from '@ionic-native/native-storage';
import { HomePage } from '../home/home';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import { CustAlert } from '../../providers/cust-alert/cust-alert';


/**
 * Generated class for the MakeNewReturnPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-make-new-return',
  templateUrl: 'make-new-return.html',
})
export class MakeNewReturnPage {

  requestNo:any;
  date:any
  quantity=[];
  selectedPrdouct=[];
  products:any;
  calValue=[];
  salable=true;
  status=[];
  expired=true;
  procal=[];
  amount:number=0;
  invoice:any;
  remarks:any;
  userId:any;
  WaitingIn_DE:any;
  waitingIn:any;
  limit:any;
  limit_de:any;
  // imagePath=[];
  /////
  imagebyte: any;
  imge:boolean=false;
  lastImage: string = null;
  loading:any;

  imagebyte2:any;
  
  attach2:string="-";
  attach1:string="-";
  attachImg1:any;
  attachImg2:any;
  fetchPStatus:any;
  expStatus:any;
  excessStatus:any;
  pstatus=[];

  public rows: Array<{ firstCol: string, secondCol: string }> = [];
  public pdrows: Array<{ firstCol: string, secondCol: string }> = [];
  private maxQuantity: number = 5;

  constructor(public navCtrl: NavController,public alert:AlertController,public loadingCtrl: LoadingController, public navParams: NavParams,private http: HttpInterceptor,public custAlert: CustAlert,private nativeStorage: NativeStorage, private base64: Base64, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform) {
  
    this.nativeStorage.getItem('userID')//userid
    .then(
    data => {
      console.log("URID from page dashoard" + data);
      this.userId = data;
      console.log("User Id:" + this.userId);
     
    },
    error => console.error(error)
    );
    this.fetchrequestNo();
    this.getAprovalLimit();
    // 
    this.date= new Date().toISOString();


    this.rows.push({ firstCol: '1 of 2', secondCol: '2 of 2' });//leave it
    this.pdrows.push({ firstCol: '1 of 2', secondCol: '2 of 2' });//leave it
  }

  public addrow(): void {
    this.rows.push({ firstCol: '1 of 2', secondCol: '2 of 2' });
  }
  public pdaddrow(): void {
    this.pdrows.push({ firstCol: '1 of 2', secondCol: '2 of 2' });
  }
  splicerow(x:string,index:number){
    console.log(x,index);
    if(x==='pdrows'){
      this.pdrows.splice(index,1);
      this.quantity.splice(index,1);
      this.status.splice(index,1);
      this.selectedPrdouct.splice(index,1);

    }else{
      // this.rows.splice(index,1);
      // this.amount.splice(index,1);
      // this.selectedType.splice(index,1);
      // this.selectedBank.splice(index,1);
      // this.bdsNo.splice(index,1);
    }

  }

  ionViewDidLoad() {
    // this.checkApproval();
    console.log('ionViewDidLoad MakeNewReturnPage');
    // this.expStatus.splice(0,1);
  }

  fetchrequestNo(){
   
        /////////products//////////
        this.http.get(Enums.APIURL.URL+'fetchproducts').map(res => res.json()).subscribe(data => {
          // debugger;
           var obj = JSON.parse(data);
          this.products = obj; 
          console.log(this.products)
            //  this.orderNo= payment[0].orderNo;
              console.log(this.products[0].idx);

            });/////end products
              //////products status
            this.http.get(Enums.APIURL.URL+'fetchproductstatus').map(res => res.json()).subscribe(data => {
              // debugger;
               var obj = JSON.parse(data);
              this.fetchPStatus = obj; 
              console.log(this.fetchPStatus);
              this.excessStatus=this.fetchPStatus[0];
              this.expStatus = this.fetchPStatus;
               
              console.log("exp",this.expStatus);
                //  this.orderNo= payment[0].orderNo;
                  //  console.log(this.fetchPStatus[0].idx);
    
                });/////products status
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
          this.custAlert.presentAlert('Duplicates','Product should not be duplicate.');
        }

        }
    }
  }
  calXquntity(index:number){
    this.removeDuplicate(index);
    console.log(index);
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

  checkStatus(){
    // console.log(index);
    // this.quantity[index] = undefined;
    console.log('status',this.status.length);
   for(var i=0;i<=status.length;i++){
    console.log('loop',i);
    if(this.status[i]==="Excess Stock"){
      this.salable=false;
      this.expired=true;
      console.log("status")
    }else if(this.status[i]==="Select"){
      this.salable=true;
      this.expired=true;
    }
    else{
      this.salable=true;
       this.expired=false;
      console.log("status false");

      }
     
    }
  }
  public getStatusText(statusInt){

    for(let p of this.fetchPStatus){
      console.log(p.idx,"::::",statusInt);
      if(""+p.idx  === statusInt){
        return p.productStatus
      }

    }
  }

  productsPrice(){
    console.log("pp");
    // alert(this.amount);
    for(var i=0;i<this.selectedPrdouct.length;i++){
      console.log(this.selectedPrdouct.length);
      // alert(this.selectedPrdouct[i]);
      for(var j=0;j<this.products.length;j++){
        // alert(this.products[j].ProductName)
        console.log('=>',this.selectedPrdouct[i],"==",this.products[j].idx);
        if(this.selectedPrdouct[i]==this.products[j].idx){
          console.log(this.selectedPrdouct[i],"==",this.products[j].idx);
          console.log(this.amount,'=>', +this.products[j].nSP);
          this.amount = +this.amount + +this.products[j].nSP ;
          // alert(this.amount);

        }

      }

    }
  }
  // uploadImg(){
  //   this.uploadString();
  //   this.imgx();
  // }
  insertInvoice(){
    this.productsPrice();
    this.checkApproval();
   
    
        let headers1 = new Headers(
          {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
          });
    
    
          let options = new RequestOptions({ headers: headers1 });
    
    
         
          
        
           let data = JSON.stringify(
            {
              "RequestNo":this.requestNo,
              "CustomerIdx" :this.userId,
              "Amount" : this.amount,
               "WaitingIn_DE":this.WaitingIn_DE,
               "WaitingIn":this.waitingIn,
               "InvoiceNo":this.invoice,
                "Remarks":"comments",
                "Status" : "0",
                "SurCharge":"0",
                 "CreditNoteNo":"0",
                 "Attachment1":this.attach1,
                 "Attachment2":this.attach2,
                 "ValueCal":"0",
                 "ApproveByRM":"0",
                 "ApproveBySM":"0",
                 "ApproveByHOS":"0",
                 "ModifiedBy":"0"
            
              
         });
          console.log(data);
          return new Promise((resolve, reject) => {
            this.http.post(Enums.APIURL.URL+'SaveSalesReturn', data, options)
            .toPromise()
            .then((response) =>
            {
            
              console.log('API Response : ', response.json());
              resolve(response.json());
              var res=JSON.parse(response.json());

              console.log(res);

              console.log(res[0].Idx);
              var idx=res[0].Idx;
               this.insertAll(idx,options);//insert products with idx
              console.log("Sumitted");
            })
            .catch((error) =>
            {
              console.error('API Error : ', error.status);
              console.error('API Error : ', JSON.stringify(error));
              reject(error.json());
            });
          });
          
        
         
      }
      insertProduct(requestIdx:string,options:any,i:number){
        let data = JSON.stringify(
          {
            "ProductIdx": this.selectedPrdouct[i].split('-')[0],
            "Quantity":this.quantity[i],
            "SalesReturnRequestIdx":requestIdx,
            "ProductStatus":this.status[i],
            "Remarks":"comments",
            "Visible" : "1",
            "ValueCal":this.calValue[i],
            "PackIdx":this.selectedPrdouct[i].split('-')[1]
            
            
           
            
       });
        
        return new Promise((resolve, reject) => {
          this.http.post(Enums.APIURL.URL+'SaveSalesReturnProduct', data, options)
          .toPromise()
          .then((response) =>
          {
          
            console.log('API Response : ', response.json());
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
      insertAll(requestIdx:string,options:any){
        for(var i=0;i<this.pdrows.length;i++){
          this.insertProduct(requestIdx,options,i)
        }
      }


      getAprovalLimit(){
        this.http.get(Enums.APIURL.URL+'fetchsalesreturnapprovallimitde').map(res => res.json()).subscribe(data => {
          // debugger;
           var obj = JSON.parse(data);
          this.limit_de = obj; 
          console.log(this.limit_de.length)
            //  this.orderNo= payment[0].orderNo;
              console.log(this.limit_de[0].designation);

            });/////end limitde

            //////
            this.http.get(Enums.APIURL.URL+'fetchsalesreturnapprovallimit').map(res => res.json()).subscribe(data => {
              // debugger;
               var obj = JSON.parse(data);
              this.limit = obj; 
              console.log(this.limit)
                //  this.orderNo= payment[0].orderNo;
                  console.log(this.limit[0].designations);
                  
    
                });/////end limit
      

                ////checking uproval values////
               

      }
      checkApproval(){
        this.WaitingIn_DE="";
        this.waitingIn="";
        if(this.expired){
          for(var i=0;i<=this.limit.length-1;i++){//aproval  limit
            if(this.limit.length-1 == i+1){
            if(this.amount>=this.limit[i].amount ||this.amount<=this.limit[i+1].amount){
              this.waitingIn=this.limit[i].designations;
            }else{
              this.waitingIn=this.limit[i+1].designations;
            }
          }
          }
        }else{
          // tslint:disable-next-line:no-duplicate-variable
          for(var i=0;i<=this.limit_de.length-1;i++){//aproval de limit
            if(this.limit_de.length-1 == i+1){
            if(this.amount>=this.limit_de[i].amount ||this.amount<=this.limit_de[i+1].amount){
              this.WaitingIn_DE=this.limit_de[i].designation;
            }else{
              this.WaitingIn_DE=this.limit_de[i+1].designation;
            }
          }
  
          }
        }
        console.log(this.limit_de.length);
        // for(var i=0;i<=this.limit_de.length-1;i++){//aproval de limit
        //   if(this.limit_de.length-1 == i+1){
        //   if(this.amount>=this.limit_de[i].amount ||this.amount<=this.limit_de[i+1].amount){
        //     this.WaitingIn_DE=this.limit_de[i].designation;
        //   }else{
        //     this.WaitingIn_DE=this.limit_de[i+1].designation;
        //   }
        // }

        // }

        // for(var i=0;i<=this.limit.length-1;i++){//aproval  limit
        //   if(this.limit.length-1 == i+1){
        //   if(this.amount>=this.limit[i].amount ||this.amount<=this.limit[i+1].amount){
        //     this.waitingIn=this.limit[i].designations;
        //   }else{
        //     this.waitingIn=this.limit[i+1].designations;
        //   }
        // }
        // }
      }
      submit(){
        let loadingg = this.loadingCtrl.create({
          content: 'Uploading...',
        });
        loadingg.present();
        this.uploadString().then((y=>{
          if(y){

         
        this.imgx().then((x=>{
          if(x){

            let alrt=false;
            if(this.pdrows.length>0){
              for(var i=0;i<this.pdrows.length;i++){
                if(this.invoice === undefined || this.selectedPrdouct[i] === undefined || this.calValue[i] === undefined || this.quantity[i] === undefined){
                  alrt=true;
                }else{
                  alrt=false;
                }
              }
              
            }
            else{
              this.custAlert.presentAlert('Bayer','Please Make request Correct!!!')
            }
            if(alrt){
              this.custAlert.presentAlert('Bayer','Please fill all fields properly.')
            }else{
              this.http.get(Enums.APIURL.URL+'fetchsalesreturnno').map(res => res.json()).subscribe(data => {
                // debugger;
                 var obj = JSON.parse(data);
                
                var req = obj; 
                this.requestNo= req[0].requestNo;
                console.log(this.requestNo)
                  //  this.orderNo= payment[0].orderNo;
                    console.log(this.requestNo);
                    this.insertInvoice();
                    this.custAlert.presentAlert('Bayer','Request Submitted to Bayer.\n Request No '+this.requestNo);
                    this.navCtrl.setRoot(HomePage);
                  },error=>{
                    this.custAlert.presentAlert('Bayer','Something Error')
                  });/////end requests

            
            }
            loadingg.dismiss();
            
          }else{
            loadingg.dismiss();
          }
        }));
      }//y if endselse{
        else{
            loadingg.dismiss();
          }
      }));
          }

 





  public presentActionSheet(attach) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY,attach);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA,attach);
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


  public takePicture(sourceType,attach) {
    // Create options for the Camera Dialog
    var options = {
      quality: 70,
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
            // this.converttobase( filePath);
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(),attach);
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName(),attach);
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
  private copyFileToLocalDir(namePath, currentName, newFileName,attach) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      console.log(this.lastImage);
      // this.imagePath[this.imgIndex]=this.lastImage;
      if(attach === 1){
        console.log('attach1');
        this.attachImg1=this.lastImage;
        this.converttobase(this.pathForImage(this.lastImage),attach);
      }else if(attach === 2) {
        console.log('attach2');
        this.attachImg2=this.lastImage;
        this.converttobase(this.pathForImage(this.lastImage),attach);
      }
     
     
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

    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();

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

  converttobase(path,attach) {
    // let filePath: string = 'file:///...';
    this.base64.encodeFile(path).then((base64File: string) => {
      if(attach === 1){
        this.imagebyte=base64File;
        console.log('base:',this.imagebyte);
      }else {
        this.imagebyte2=base64File;
        console.log('base:',this.imagebyte2);
      }
    });
  }

  uploadString(){
    return new Promise((res) => {
      if(this.imagebyte != undefined){
    var imgggg=this.imagebyte;
    var img2= imgggg.split("base64,");
    var img3=img2[1];
    console.log(img2);
    console.log(img3);
    var url = Enums.APIURL.URL+"SavePng";
    let headers1 = new Headers(
      {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      });
   
 
      let options = new RequestOptions({ headers: headers1 });
      
      
   
       let data = JSON.stringify(
        {
        
           Name:img3
         
          
     });
  
    //  console.log(data);
     
      return new Promise((resolve, reject) => {
        this.http.post(url,data, options)
        .toPromise()
        .then((response) =>
        {
        
          console.log('API Response : ', response.json());
          this.attach1=response.json();
        //  this.showAlert("Bayer","Your feedback has been sent to Bayer.\n Thankyou.");
          // this.navCtrl.setRoot(HomePage);
          
          resolve(response.json());
          res(true);
        })
        .catch((error) =>
        {
          console.error('API Error : ', error.status);
          console.error('API Error : ', JSON.stringify(error));
          reject(error.json());
        });
      });
    }else{
      this.attach1="-"
      res(true);
    }
    });//res
  }
  imgx(){
    // var imgggg=this.imagebyte;
    // var img2= imgggg.split("base64,");
    // var img3=img2[1];
    // console.log(img2);
    // console.log(img3);

    return new Promise((res) => {
      if(this.imagebyte2 != undefined){

        var imggggx=this.imagebyte2;
        var imgx= imggggx.split("base64,");
        var img3x=imgx[1];
        console.log(imgx);
        console.log(img3x);
        
        var url = Enums.APIURL.URL+"SavePng";
        let headers1 = new Headers(
          {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
          });
          
          
          let options = new RequestOptions({ headers: headers1 });
          
          
          
          let data = JSON.stringify(
            {
              
              Name:img3x
              
              
            });
            
            //  console.log(data);
            
            return new Promise((resolve, reject) => {
              this.http.post(url,data, options)
              .toPromise()
              .then((response) =>
              {
                
                console.log('API Response : ', response.json());
                this.attach2=response.json();
                //  this.showAlert("Bayer","Your feedback has been sent to Bayer.\n Thankyou.");
                // this.navCtrl.setRoot(HomePage);
                
                resolve(response.json());
                res(true);
              })
              .catch((error) =>
              {
                console.error('API Error : ', error.status);
                console.error('API Error : ', JSON.stringify(error));
                reject(error.json());
              });
            });
          }else{
            this.attach2="-"
            res(true);
          }
          });//res
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


