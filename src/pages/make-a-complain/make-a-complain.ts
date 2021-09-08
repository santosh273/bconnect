import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Alert, AlertController, ActionSheetController, ToastController, Platform } from 'ionic-angular';
import { Http,Headers, RequestOptions } from '@angular/http';
import { NativeStorage } from '@ionic-native/native-storage';
import * as Enums from '../../models/interfaces/enums'
import { HomePage } from '../home/home';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import { CustAlert } from '../../providers/cust-alert/cust-alert';
// import { Http,Headers, RequestOptions } from '@angular/http';
/**
 * Generated class for the MakeAComplainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-make-a-complain',
  templateUrl: 'make-a-complain.html',
})
export class MakeAComplainPage {
  complainNo:any;
  complainCat:any;
  requestType:any;
  loading:any;
  selectedComp:any;
  selectedReq:any;
  selectedCat:any;
  showReq:boolean = false;
  changeReqTxt:any;
  subject:any;
  remarks:any;
  custumerIDX:any;
  complainType:any;
  compType:any;
  showComCat:boolean=false;
  lastImage: string = null;
  // loading: Loading;
  imagebyte: any;
  imagebyte2:any;
  imge:boolean=false;
  attach2:string="-";
  attach1:any;
  attachImg:any;

  constructor(public navCtrl: NavController,public alert:AlertController, private base64: Base64,public alertCtrl: AlertController, public navParams: NavParams,private nativeStorage: NativeStorage,public loadingCtrl: LoadingController,private http: HttpInterceptor, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform,private custAlert:CustAlert) {
  
      ///get user id:
            this.nativeStorage.getItem('userID')//userid crtdbyID
            .then(
            data => {
              console.log("URID from page dashoard" + data);
              this.custumerIDX = data;
              console.log("User Id:" + this.custumerIDX);
            
            },
            error => console.error(error)
            );
          this.loading = this.loadingCtrl.create({
            spinner: 'bubbles',
            content: `
              
              <div>Loading...</div>`,
          
          });
      this.getAlldetails();
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MakeAComplainPage');
  }


  getAlldetails(){
     this.loading.present();
   
        ////complain no: ens


        //get complaintype
        this.http.get(Enums.APIURL.URL+'fetchComplainType').map(res => res.json()).subscribe(data => {//complain no:
          // debugger;
           var obj = JSON.parse(data);
          // alert(obj[0].userName);
             this.compType = obj;
             console.log(this.compType);
            //  if(this.posts[0] === undefined){
            //   this.nodata = true;
    
            // }
            // else{
            //   this.nodata = false;
            // }
              this.loading.dismiss();
        
            });


        // this.loading.present();
        this.http.get(Enums.APIURL.URL+'fetchcomplaincategory').map(res => res.json()).subscribe(data => {//categroies :
          // debugger;
           var obj = JSON.parse(data);
             this.complainCat = obj; 
             console.log(this.complainCat);
            //  this.loading.dismiss();
        
            });
            //end categories

            // this.loading.present();
            this.http.get(Enums.APIURL.URL+'fetchchangerequesttype').map(res => res.json()).subscribe(data => {//requesttype :
              // debugger;
               var obj = JSON.parse(data);
             
                 this.requestType = obj; 
                 console.log(this.requestType);
                //  if(this.posts[0] === undefined){
                //   this.nodata = true;
        
                // }
                // else{
                //   this.nodata = false;
                // }
                //  this.loading.dismiss();
            
                });
                //requestType ends here:

  }
  showComplainCategory(){
    if(this.selectedComp === "2"){
      this.showComCat = true;
      console.log(this.showComCat);

    }else{
      this.showComCat = false;
      console.log(this.showComCat);
    }
  }

  showChangeRequestType(){
    this.showComplainCategory();
    if(this.selectedComp === "3"){
      this.showReq = true;
      this.subject=this.GetComplainTypeName(this.selectedComp);
      this.remarks='-';
      console.log(this.showReq);

    }else{
      this.showReq = false;
      console.log(this.showReq);
      if(this.subject==this.GetComplainTypeName(3)){
        this.subject='';
        this.remarks='';
      }
    }
  }

  GetComplainTypeName(cmptID):any{
    let tempName:any='-';
    //  console.log("Products are: "+JSON.stringify(this.products));
    for(let cmp of this.compType)
      {
          if(cmp.idx==cmptID){
            tempName=cmp.complainTypes;
          }
      }
      return tempName;
  }
    postComplain(){
      let loadingg = this.loadingCtrl.create({
        content: 'wait please...',
      });
      loadingg.present();
      if(this.selectedComp === "3"){

       if(this.selectedReq === "Profile Image"){
        this.uploadString().then((x=>{ 
          if(x){
            if(this.selectedComp != undefined && this.subject != undefined && this.remarks != undefined){
              this.http.get(Enums.APIURL.URL+'fetchcomplainno').map(res => res.json()).subscribe(data => {
                var obj = JSON.parse(data);
               // alert(obj[0].userName);
                  this.complainNo = obj[0].complainNo; 
                   // post data to servr
                    this.PostRequestWithImage().then(resolve=>{
                      loadingg.dismiss();
                    },reject=>{
                      loadingg.dismiss();
                    }).catch(()=>loadingg.dismiss());
                 },
               error=>{
                 loadingg.dismiss();
               });
              }else{
                this.custAlert.presentAlert("Bayer","Please fill all fields properly.");
                loadingg.dismiss();
                // alert("");
              }
              
          }else{
          loadingg.dismiss();
          this.custAlert.presentAlert("Bayer","Please fill all fields properly.");
          }
         }));
       }else{
             if(this.selectedReq){
               if(this.selectedComp != undefined && this.subject != undefined && this.remarks != undefined&&this.changeReqTxt!=undefined){
                 
                this.http.get(Enums.APIURL.URL+'fetchcomplainno').map(res => res.json()).subscribe(data => {
                  var obj = JSON.parse(data);
                 // alert(obj[0].userName);
                    this.complainNo = obj[0].complainNo; 
                     // post data to servr
                     this.postRequestWithoutImage().then(resolve=>{
                      loadingg.dismiss();
                     },
                    reject=>{
                      this.loading.dismiss();
                    }).catch(()=>loadingg.dismiss());
                   },
                 error=>{
                   loadingg.dismiss();
                 });
               }else
               {
                loadingg.dismiss();
                this.custAlert.presentAlert("Bayer","Please fill all fields properly.");
               }

             }else{
              loadingg.dismiss();
              this.custAlert.presentAlert("Bayer","Please fill all fields properly.");
             }
       }
      }else if(this.selectedComp === "2"){
        if(this.remarks === undefined){
          this.remarks="-"
        }
        if( this.selectedComp != undefined && this.subject != undefined && this.remarks != undefined && this.selectedCat!=undefined){
         
          this.http.get(Enums.APIURL.URL+'fetchcomplainno').map(res => res.json()).subscribe(data => {
            var obj = JSON.parse(data);
           // alert(obj[0].userName);
              this.complainNo = obj[0].complainNo; 
               // post data to servr
              
          this.postRequestWithoutImage().then(resolve=>{
            loadingg.dismiss();
           },
          reject=>{
            this.loading.dismiss();
          }).catch(()=>loadingg.dismiss());
             },
           error=>{
             loadingg.dismiss();
           });

          }else{
            this.custAlert.presentAlert("Bayer","Please fill all fields properly.");
            loadingg.dismiss();
          }
          
      }else if(this.selectedComp === "1"){
        if(this.remarks === undefined){
          this.remarks="-"
        }
        if( this.selectedComp != undefined && this.subject != undefined && this.remarks != undefined){
          
          this.http.get(Enums.APIURL.URL+'fetchcomplainno').map(res => res.json()).subscribe(data => {
             var obj = JSON.parse(data);
            // alert(obj[0].userName);
               this.complainNo = obj[0].complainNo; 
               this.postRequestWithoutImage().then(resolve=>{
                loadingg.dismiss();
               },
              reject=>{
                this.loading.dismiss();
              }).catch(()=>loadingg.dismiss());
              },
            error=>{
              loadingg.dismiss();
            });
      
        
          }else{
            this.custAlert.presentAlert("Bayer","Please fill all fields properly.");
            loadingg.dismiss();
          }
      }else{
        this.custAlert.presentAlert("Bayer","Please select support type.");
        loadingg.dismiss();
      }
          // this.imgx();
          // this.loading.present();  
 }
 getSupportType(supTID):string{
  if(supTID==1){
    return 'Suggestion';
  }else if(supTID==2){
     return 'Complain';
  }else if(supTID==3){
    return 'Profile Change Request';
  }else{
    return '-';
  }
}
postRequestWithoutImage(){
  console.log('supporttype' ,this.selectedComp);
console.log(this.selectedReq,this.changeReqTxt,this.selectedCat)
 
  if(this.selectedComp === "3"){
    // this.selectedReq="-";
    // this.changeReqTxt="-";
     this.selectedCat="-";
    console.log('if 3');
    
  }else if(this.selectedComp === "2"){
    this.selectedReq="-";
    this.changeReqTxt="-";
    console.log('if 2');
  }else{
    console.log('else');
    this.selectedReq="-";
    this.changeReqTxt="-";
    this.selectedCat="-";
  }
  
  let headers1 = new Headers(
    {
    'Accept' : 'application/json',
    'Content-Type' : 'application/json'
  });
  
  let options = new RequestOptions({ headers: headers1 });
  
  let data;
    data = JSON.stringify(
      {
        "ComplainNo" : this.complainNo,
        "CustomerIdx" : this.custumerIDX,
        "Subject" : this.subject,
        "ComplainCategory" : this.selectedCat,
        "ChangeRequestType" : this.selectedReq,
        "ChangeRequestText" : this.changeReqTxt,
        "Description" : this.remarks,
        "ComplainType" : this.getSupportType(this.selectedComp),
        "Remarks":"",
        "Status" : "Open",
        "WaitingIn" : "3",
        "ProfileImage" : ""
      });
      
      console.log(data);
    return new Promise((resolve, reject) => {
      this.http.post(Enums.APIURL.URL+'savecustomercomplain', data, options)
      .toPromise()
      .then((response) =>
      {
        console.log('API Response : ', response.json());
        this.custAlert.presentAlert("Bayer","Your feedback has been sent to Bayer.\nSupport No: "+this.complainNo+"\n Thankyou.");
        this.navCtrl.setRoot(HomePage);
        
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
 PostRequestWithImage(){
  if(this.selectedComp === "3"){
    // this.selectedReq="-";
    this.changeReqTxt="-";
    this.selectedCat="-";
    
  }else if(this.selectedComp === "2"){
    this.selectedReq="-";
    this.changeReqTxt="-";
  }else{
    this.selectedReq="-";
    this.changeReqTxt="-";
    this.selectedCat="-";
  }
  let headers1 = new Headers(
    {
    'Accept' : 'application/json',
    'Content-Type' : 'application/json'
  });
  
  let options = new RequestOptions({ headers: headers1 });
  
  let data;
  // if(this.attach2 === "-"){
    data = JSON.stringify(
      {
        "ComplainNo" : this.complainNo,
        "CustomerIdx" : this.custumerIDX,
        "Subject" : this.subject,
        "ComplainCategory" : this.selectedCat,
        "ChangeRequestType" : this.selectedReq,
        "ChangeRequestText" : this.changeReqTxt,
        "Description" : this.remarks,
        "ComplainType" :this.getSupportType(this.selectedComp),
        "Remarks":"",
        "Status" : "Open",
        "WaitingIn" : "3",
        "ProfileImage" : "~/FilesFolder/"+this.attach2
      });
      console.log("Customer Complain JsonFormat................")
      console.log(data);
  // }
    return new Promise((resolve, reject) => {
      this.http.post(Enums.APIURL.URL+'savecustomercomplain', data, options)
      .toPromise()
      .then((response) =>
      {
        
        console.log('API Response : ', response.json());
        // this.uploadString();
        this.custAlert.presentAlert("Bayer","Your feedback has been sent to Bayer.\nSupport No: "+this.complainNo+"\n Thankyou.");
        this.navCtrl.setRoot(HomePage);
        
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
    ///////
    public presentActionSheet() {
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
              // this.converttobase( filePath)
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
              this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            });
        } else {
          var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
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
        console.log(this.lastImage);
        this.attachImg=this.lastImage;
        this.converttobase(this.pathForImage(this.lastImage));
       
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
  
    converttobase(path) {
      // let filePath: string = 'file:///...';
      let loadingg = this.loadingCtrl.create({
        content: 'wait please...',
      });
      loadingg.present();
      this.base64.encodeFile(path).then((base64File: string) => {
        // if(this.imagebyte === undefined){
          this.imagebyte=base64File;
          loadingg.dismiss();
          console.log('base:',this.imagebyte);
        // }else {
        //   this.imagebyte2=base64File;
        //   console.log('base:',this.imagebyte2);
        // }
        
       
      }, (err) => {
        console.log(err);
      });
    }
  
    uploadString(){
      return new Promise((resolvee=>{
        let loadingg = this.loadingCtrl.create({
          content: 'wait please...',
        });
        loadingg.present();
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
          
            return new Promise((resolve, reject) => {
              this.http.post(url,data, options)
              .toPromise()
              .then((response) =>
              {
                
                console.log('API Response : ', response.json());
                this.attach2 = response.json();
                loadingg.dismiss();
                resolve(response.json());
                resolvee(true);
              })
              .catch((error) =>
              {
                console.error('API Error : ', error.status);
                console.error('API Error : ', JSON.stringify(error));
                reject(error.json());
              });
            });

            
          }));
            
          }//uplod end
    


    showImg(){
      // this.showComplainCategory();
    if(this.selectedReq === "Profile Image"){
      this.imge = true;
      console.log(this.imge);

    }else{
      this.imge = false;
      console.log(this.imge);
    }

    }

    showImgg(image){
      let alert = this.alert.create({
        // title: 'Image',
        message: '<div> <img width="200px" height="auto" src="'+image+'" > </div>',
        buttons: ['Close']
      });
      alert.present();
  
    }
  
  
}
