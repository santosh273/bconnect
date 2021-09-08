import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotifcationListPage } from './notifcation-list';

@NgModule({
  declarations: [
    NotifcationListPage,
  ],
  imports: [
    IonicPageModule.forChild(NotifcationListPage),
  ],
})
export class NotifcationListPageModule {}
