import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';




@Component({
  selector: 'page-sales',
  templateUrl: 'sales.html'
})
export class SalesPage {

  pendingRoot = 'PendingPage'
  completedRoot = 'CompletedPage'
  rejectedRoot = 'RejectedPage'
userId:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userId = navParams.get('userID');
    console.log("sales"+this.userId);
  }

}
