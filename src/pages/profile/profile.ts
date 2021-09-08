import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, ToastController, Platform, LoadingController } from 'ionic-angular';
import { Base64 } from '@ionic-native/base64';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import { Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { Http,Headers, RequestOptions } from '@angular/http';
import * as Enums from '../../models/interfaces/enums'
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  response: any;
  address: any="";
  email: any="";
  phoneno: any="";
  attach="-";
  lastImage: any;
  customerNo="";
  public profileImg="assets/imgs/nophoto.jpg";
  constructor( private file: File, public loadingCtrl: LoadingController, private filePath: FilePath, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform,private http: HttpInterceptor, private camera: Camera,private base64: Base64,public alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams) {
        this.email=navParams.get('email');
        this.address=navParams.get('address');
        this.phoneno=navParams.get('phoneno');
        this.customerNo=navParams.get('customerNo');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
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
      quality: 60,
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

  uploadString(){
    return new Promise((resolvee=>{
      let loadingg = this.loadingCtrl.create({
        content: 'wait please...',
      });
      loadingg.present();
      var imgggg=this.profileImg;
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
              this.attach = response.json();
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
  

  converttobase(path) {
   
    let loadingg = this.loadingCtrl.create({
      content: 'wait please...',
    });
    loadingg.present();
    this.base64.encodeFile(path).then((base64File: string) => {
     
        this.profileImg=base64File;
        loadingg.dismiss();

    }, (err) => {
      console.log(err);
    });
  }
  updateProfile(){
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      
    });
    loader.present();
    ///*****getZones****/////
    console.log('lok1');
    this.http.get(Enums.APIURL.URL+'/profileupdate/'+this.address+'/'+this.email+'/'+this.attach+'/'+this.customerNo+'/'+this.phoneno).map(res => res.json()).subscribe(data => {
      console.log('lok2');
      // var obj = JSON.parse(data);
      // this.response=obj;
      loader.dismiss();
      alert('Your Profile has been update ! Please go back and click refresh button');
      console.log('profile updated',data);
      
    }, err => {
      loader.dismiss()
      console.log(err);
     
    });
    //end
}

updateAll(){
  if(this.email !="" && this.address !=""){
    if(this.profileImg == "assets/imgs/nophoto.jpg"){
      this.updateProfile();
      }else{
        this.uploadString().then(res=>{
          console.log('lok');
          this.updateProfile();
        });
      }
  }else{
    alert('Please fill relevant fields.');
  }
 
}

}
