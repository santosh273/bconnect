import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the SchemePage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-scheme',
  templateUrl: 'scheme.html'
})
export class SchemePage {

  activeRoot = 'ActivePage'
  inActiveRoot = 'InActivePage'


  constructor(public navCtrl: NavController) {}

}
