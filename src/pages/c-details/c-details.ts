import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, ModalController, Events } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import * as Enums from '../../models/interfaces/enums';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeStorage } from '@ionic-native/native-storage';
/**
 * Generated class for the CDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google;

@IonicPage()
@Component({
  selector: 'page-c-details',
  templateUrl: 'c-details.html',
})
export class CDetailsPage {
  adminRemarks: any;
  img6: string;
  img7: string;
  img5: string;
  i: number;
  type: any;
  remarks: any;
  btnReject: boolean=false;
  btnApprove: boolean=false;
  waitingIn2: any;
  waitingIn: any;
  response: any;
  user: any;
  img4: string;
  img3: string;
  img2: string;
  img0: string;
  img1: string;
  urlapp: string;
  attach = [];
  nodata: boolean;
  @ViewChild('map') mapElement: ElementRef;
  req: any;
  markerlatlong: any;

  map: any;
  public imgUrl = Enums.APIURL.WEB_APP_URL + 'FilesFolder/';
  public proUrl = Enums.APIURL.WEB_APP_URL;
  position: Geoposition;
  lat;
  lng;
  constructor(public events:Events ,public modalCtrl: ModalController,private toastCtrl: ToastController, private alertCtrl: AlertController, private nativeStorage: NativeStorage, private iab: InAppBrowser, public geolocation: Geolocation, public loadingCtrl: LoadingController, private http: HttpInterceptor, public navCtrl: NavController, public navParams: NavParams) {
    this.req = navParams.get('REQ');

    this.nativeStorage.getItem('profile')//EmpIDX2
      .then(
        data => {
          console.log("URID from page dashoard" + data);
          this.user = data;
          console.log("userName:" + this.user[0]);
          console.log('DESI::::', this.user[0].designationIdx);
          this.getButtonStatus();

        },
        error => console.error(error)
      );

    console.log(this.req);
    this.getAllAttachments(this.req.idx);
    this.i=0;
    events.subscribe('remarks:type',(remarks,type) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
  
    if(this.i==0){
      this.i++;
      this.btnApprove = false;
      this.btnReject = false;
    }
      console.log(remarks,type);
     
      this.events.unsubscribe('remarks:type');
     
    });
    this.getRemarks(this.req.idx);
  }
  getRemarks(idx){
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      
    });
    loader.present();
    ///*****getZones****/////
    this.http.get(Enums.APIURL.URL+'getremarks/'+idx).map(res => res.json()).subscribe(data => {
       var obj = JSON.parse(data);
      this.adminRemarks=obj;
      loader.dismiss();
      console.log('adminRemarks',obj);
      
    }, err => {
      loader.dismiss()
      console.log(err);
     
    });
    //end
}

  getButtonStatus() {
    this.waitingIn = this.req.waitingIn2;
    console.log(this.req.waitingIn2, '::', this.waitingIn);
    let dIDX: string = '' + this.user[0].designationIdx;
    if (this.waitingIn != "") {
      this.waitingIn2 = this.waitingIn.split(",");
    
      for (var i = 0; i <= this.waitingIn2.length; i++) {
      
        if (dIDX==this.waitingIn2[i]) {
        
          this.btnApprove = true;
          this.btnReject = true;
          break;
        }else {
          this.btnApprove = false;
          this.btnReject = false;
          break;
        } 
       
      }
    } else {
      this.btnApprove = false;
      this.btnReject = false;
    
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CDetailsPage');
   // this.loadMap();


  }
  loadMap() {

    console.log(this.req.latitude, "long:", this.req.longitude);
    let latLng = new google.maps.LatLng(+this.req.latitude, +this.req.longitude);
    let mapOptions = {
      center: latLng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker();
  }
  addMarker() {
    let marker = new google.maps.Marker({
      map: this.map,
      draggable: false,
      icon: { url: 'assets/imgs/marker.png',
      scaledSize: {
        width: 80,
        height: 85
      } },
      animation: google.maps.Animation.DROP,
      position: {
        lat: +this.req.latitude,
        lng: +this.req.longitude
      }

    });
    var lat = marker.getPosition().lat();
    var lng = marker.getPosition().lng();
    this.lat = lat;
    this.lng = lng;
    console.log(marker.Geoposition);
    console.log("loc", lat, lng);
    console.log("Shahid");
    let content = "<h4>Lat: " + lat + "<br>Lng: " + lng + "</h4>";
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
  }

  getAllAttachments(EMPIDX: any) {
    console.log(EMPIDX);
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      enableBackdropDismiss: true

    });
    loader.present();
    console.log('getnoti');
    this.http.get(Enums.APIURL.URL + 'getcustomerattachments/' + this.req.idx).map(res => res.json()).subscribe(data => {
      // debugger;
      console.log();
      loader.dismiss();
      var obj = JSON.parse(data);
      this.attach = obj;
      // console.log(this.imgUrl + this.attach[3].attachment1,
      //   this.img0 = this.imgUrl + this.attach[0].attachment1,
      // this.img1 = this.imgUrl + this.attach[1].attachment1,
      // this.img2 = this.imgUrl + this.attach[2].attachment1,
      // this.img3 = this.imgUrl + this.attach[3].attachment1,
      // this.img4 = this.imgUrl + this.attach[4].attachment1,
      // this.img5 = this.imgUrl + this.attach[5].attachment1,
      // this.img6 = this.imgUrl + this.attach[6].attachment1,
      // this.img7 = this.imgUrl + this.attach[7].attachment1);
      try{
        this.img0 = this.imgUrl + this.attach[0].attachment1;
        this.img1 = this.imgUrl + this.attach[1].attachment1;
        this.img2 = this.imgUrl + this.attach[2].attachment1;
        this.img3 = this.imgUrl + this.attach[3].attachment1;
        this.img4 = this.imgUrl + this.attach[4].attachment1;
        this.img5 = this.imgUrl + this.attach[5].attachment1;
        this.img6 = this.imgUrl + this.attach[6].attachment1;
        this.img7 = this.imgUrl + this.attach[7].attachment1;
      }catch(err){
       
      }
     
      if (this.attach === undefined) {
        this.nodata = true;
      }
      else {
        this.nodata = false;
      }
    }, err => {
      loader.dismiss();
      console.log(err);
    });

  }


  Viewfile(urlText: string) {
    let target = "_system";
    // this.urlapp = Enums.APIURL.WEB_APP_URL+'FilesFolder/';
    this.iab.create(urlText, '_blank', 'location=no,toolbar=no');
  }

  aproveReject(type) {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      enableBackdropDismiss: true

    });
    loader.present();

    this.http.get(Enums.APIURL.URL + 'approverejectcustomerrequest/' + this.req.idx + "/" + type + "/" + this.user[0].designationIdx + "/" + this.user[0].idx2 + "/" +this.remarks).map(res => res.json()).subscribe(data => {

      console.log(Enums.APIURL.URL + 'approverejectcustomerrequest/' + this.req.idx + "/" + type + "/" + this.user[0].designationIdx + "/" + this.user[0].idx2);
      var obj = data;
      this.response = obj;
      if (this.response == "done") {
        this.toast('You ' + type + ' the customer for Bayer.');
        this.btnApprove = false;
        this.btnReject = false;
      }
      console.log(this.response);
      loader.dismiss();
    }, err => {
      loader.dismiss();
      this.toast('Error:' + err);
      console.log(err);
    });
  }

  confirm(type) {
    this.type=type;
    this.presentPrompt(type);
    // let alert = this.alertCtrl.create({
    //   title: 'Confirm ' + type,
    //   message: 'Do really want to ' + type + '?',
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       role: 'cancel',
    //       handler: () => {
    //         console.log('Cancel clicked');
    //       }
    //     },
    //     {
    //       text: '' + type,
    //       handler: () => {
    //         console.log('Buy clicked');
    //         this.presentPrompt(type);
    //       }
    //     }
    //   ]
    // });
    // alert.present();
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
  presentPrompt(type) {
   // + this.req.idx + "/" + type + "/" + this.user[0].designationIdx + "/" + this.user[0].idx2 + "/" +this.remarks
    let profileModal = this.modalCtrl.create('ModalPage', { TYPE: type,REQ:this.req.idx, DESI: this.user[0].designationIdx ,IDX:this.user[0].idx2});
    profileModal.present();
  }

  // ionViewWillEnter() {
  //   let loader=this.loadingCtrl.create({
  //     content: "Please wait remarks...",
  //     duration: 3000
  //   });
  //   loader.present();
    
  //   this.nativeStorage.getItem('remarks')
  //     .then(
  //       data => {
  //         this.type = data.type;
  //         this.remarks = data.remarks;
  //         console.log(data.type, data.remarks)
  //         this.aproveReject(this.type);
  //         loader.dismiss();
  //       },

  //       error => {console.error(error)
 
  //         loader.dismiss(); }
  //       );
  // }

}
