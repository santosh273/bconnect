import { Component } from '@angular/core';
import { IonicPage,  ViewController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the InfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {

  constructor(public viewCtrl: ViewController,private nativeStorage: NativeStorage) {

  }
  Info='condi_of_use';
  dismiss() {
    this.viewCtrl.dismiss();
  }
SaveAggrement(){
  this.nativeStorage.setItem('Agrement', true)
             .then(
             () => console.log('Agrement Saved'),
             error => console.error('Error in Agrement', error)
             );//userId ends
}
}
