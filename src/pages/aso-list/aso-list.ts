import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the AsoListPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-aso-list',
  templateUrl: 'aso-list.html'
})
export class AsoListPage {

  asoPendingRoot = 'AsoPendingPage'
  asoCompletedRoot = 'AsoCompletedPage'
  asoRejectedRoot = 'AsoRejectedPage'


  constructor(public navCtrl: NavController) {}

}
