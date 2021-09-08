import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';

/*
  Generated class for the CustAlertProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CustAlert {

  constructor(private alertCtrl:AlertController,private toastCtrl:ToastController) {}
  presentAlert(title,msg,btntext?) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg?msg:'Internet connectivity/Server related problem occured. Try again later.',
      buttons: [btntext?btntext:'Ok']
    });
    alert.present();
  }
  presentToast(msg,duration?,position?) {
    let toast = this.toastCtrl.create({
      message: msg?msg:'Internet connectivity/Server related problem occured.\nTry again later.',
      duration: duration?duration:5000,
      position: position?position:'middle'
    });
    toast.present();
  }
}
