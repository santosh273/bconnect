import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';
import { HttpInterceptor } from '../../providers/http-interceptor/http-interceptor';
import 'rxjs/add/operator/map';
import * as Enums from '../../models/interfaces/enums';
import { NativeStorage } from '@ionic-native/native-storage';
import { HomePage } from '../home/home';
/**
 * Generated class for the GiftsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gifts',
  templateUrl: 'gifts.html',
})
export class GiftsPage {
  requested: number;
  msg: any;
  giftspoints: number = 0;
  user: any;
  code: string;
  totalPoints: number = 0;
  points: any;
  userId: any;
  loopcounter = 0;
  // gifts=["1","2","3","5","6"];
  public imageUrl = Enums.APIURL.WEB_APP_URL + "FilesFolder/"
  gifts: any;
  giftt = [];
  address = [];
  remaing: number
  mailingaddress = '';
  available: number = 0;
  consumed: number = 0;
  rewardmonth: any;
  bgp: number;
  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl: ToastController, public nativeStorage: NativeStorage, public navCtrl: NavController, public navParams: NavParams, public http: HttpInterceptor) {

    this.nativeStorage.getItem('profile')//EmpIDX2
      .then(
        data => {
          console.log("URID from page dashoard" + data);
          this.user = data;

          this.code = this.user[0].customerNo;
          this.mailingaddress = this.user[0].address;
          console.log('address:', this.user[0].address);
          // this.name=this.user[0].firstName +" "+this.user[0].lastName
          console.log("userName:" + this.user[0].firstName + this.user[0].lastName);
          this.getPoints();
        },
        error => console.error(error)
      );
    this.nativeStorage.getItem('userID')//userid
      .then(
        data => {
          console.log("URID from page dashoard" + data);
          this.userId = data;
          // this.getRemaing();
        }
      );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GiftsPage');
    this.getGifts();
    this.getDisclaimer();
  }

  consol(points, idx) {

    if (this.available > this.points) {

    }




  }
  getPoints() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
    });
    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });
    let updated = 0;
    let bgp = 0;

    loading.present();
    console.log('THIS.CODE :::' + this.code);
    this.http.get(Enums.APIURL.URL + 'getcustomerpoints/' + this.code).map(res => res.json()).subscribe(data => {
      console.log(Enums.APIURL.URL + 'getcustomerpoints/' + this.code);
      loading.dismiss();
      var obj = JSON.parse(data);

      this.points = obj;

      // for(var i=0){

      // }
      for (let p of this.points) {
        if (p.labels != 'BGP') {
          updated += Number(p.updated);
        }
        else {
          bgp += Number(p.updated);

        }
        this.totalPoints = Number(p.totalPoints);
        this.requested = Number(p.requestedpoints);
        this.consumed = Number(p.consumedpoints);
        this.available = Number(p.availablepointstotal);
        console.log(p);
      }
      this.totalPoints = updated;
      this.bgp = bgp;
    }, err => {
      loading.dismiss();
      alert(err);

      console.log(err)
    });


    this.http.get(Enums.APIURL.URL + 'rewardmonth').map(res => res.json()).subscribe(data => {
      var obj = data;
      this.rewardmonth = obj;

    }, err => {

      alert(err);

      console.log(err)
    });

  }
  getRemaing() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
    });

    loading.present();

    this.http.get(Enums.APIURL.URL + 'giftspendingpointcount/' + this.userId).map(res => res.json()).subscribe(data => {
      console.log(Enums.APIURL.URL + 'giftspendingpointcount/' + this.userId);
      loading.dismiss();
      var obj = JSON.parse(data);

      this.remaing = obj;




    }, err => {
      loading.dismiss();
      alert(err);

      console.log(err)
    });
  }

  getGifts() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
    });

    loading.present();
    this.http.get(Enums.APIURL.URL + 'getgifts').map(res => res.json()).subscribe(data => {
      var obj = JSON.parse(data);
      this.gifts = obj;
      console.log(obj);
      loading.dismiss();
    }, err => {
      // alert(err);
      loading.dismiss();
      console.log(err)
    });
  }
  getDisclaimer() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
    });

    loading.present();
    this.http.get(Enums.APIURL.URL + 'fetchdisclaimermessage').map(res => res.json()).subscribe(data => {
      // var obj = JSON.parse(data);
      this.msg = data;
      console.log(data);
      this.nativeStorage.setItem('msg', this.msg);
      loading.dismiss();
    }, err => {
      try {
        this.nativeStorage.getItem('msg').then(data => {
          this.msg = data;
        });
      } catch (exception) {

      }
      // alert(err);
      loading.dismiss();
      console.log(err)
    });
  }

  uploadGifts(address) {
    if (this.giftt.length > 0) {
      for (var i = 0; i < this.gifts.length; i++) {
        let ress: boolean;
        if (this.giftt[i]) {
          console.log(this.gifts[i], i);
          this.sendGiftReq(this.userId, this.gifts[i].idx, address, i).then(res => {
            console.log('res', res);



          });

        } else if (this.giftt[i] == false) {
          // this.presentToast('No gift selected');
        }
      }
    } else {
      this.presentToast('No gift selected');
    }
  }
  sendGiftReq(customerIDX, giftIDX, address, i) {

    return new Promise(resolve => {
      let loading = this.loadingCtrl.create({
        spinner: 'dots',
      });
      loading.onDidDismiss(() => {
        console.log('Dismissed loading');
      });
      loading.present();

      // / customergiftinsert/customeridx/giftidx/courier address
      this.http.get(Enums.APIURL.URL + 'customergiftinsert/' + customerIDX + "/" + giftIDX + "/" + address).map(res => res.json()).subscribe(data => {
        // var obj = JSON.parse(data);
        loading.dismiss();
        this.giftt[i] = false;
        if (this.loopcounter == 0) {
          // this.getRemaing();
          this.disclaimer();

          this.loopcounter = 12;
          setTimeout(() => {
            this.getPoints();
          }, 3000);

        }
        console.log(data);
        this.presentToast("Gift Requested");
        resolve(true);
      }, err => {
        loading.dismiss();
        alert(err);
        console.log(err)
        resolve(false);
      });

    });

  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
  showPrompt() {
    if (this.rewardmonth === "true") {
      this.giftspoints = 0;
      for (var i = 0; i < this.gifts.length; i++) {

        // console.log(this.giftt[i])
        if (this.giftt[i]) {

          this.giftspoints = this.giftspoints + Number(this.gifts[i].points);
          console.log(this.giftspoints);


        }
      }
      console.log('points:', this.totalPoints > this.giftspoints);
      // this.totatavailbel=this.available-this.requested
      if ((this.available - this.requested) < this.giftspoints) {
        this.presentToast('You can only select gifts in your points range :(');

      } else {

        const prompt = this.alertCtrl.create({

          title: 'Address',
          message: "Please enter your address to get your gift.",
          inputs: [
            {
              name: 'address',
              value: this.mailingaddress,
              placeholder: 'Address Here Please.'
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              handler: data => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Request',
              handler: data => {
                console.log(data.address);
                console.log(data);
                if (data.address != "") {
                  this.uploadGifts(data.address);
                } else {
                  alert('Address  must not be null.');
                }

                console.log('Saved clicked');
              }
            }
          ]
        });
        prompt.present();
      }
    }
    else {

      alert('Bayer is currently not accepting Gift requests, It will be open in April and October ');

    }
  }
  mygifts() {
    this.navCtrl.push('GiftsStatusPage');
  }
  disclaimer() {
    const prompt = this.alertCtrl.create({
      title: 'Disclaimer',
      message: this.msg,
      // "Gift will be sent to you at the availability of gift, Gift may differ be from the image shown in list. The company will not be responsible for the breakage or damage of the gift."
      // inputs: [
      //   {
      //     name: 'address',
      //     placeholder: 'Address Here Please.'
      //   },
      // ],
      buttons: [
        // {
        //   text: 'Cancel',
        //   handler: data => {
        //     console.log('Cancel clicked');
        //   }
        // },
        {
          text: 'OK',
          handler: data => {
            console.log('OKEY clicked');
          }
        }
      ]
    });
    prompt.present();
  }

}
