import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AsoNotificationListPage } from './aso-notification-list';

@NgModule({
  declarations: [
    AsoNotificationListPage,
  ],
  imports: [
    IonicPageModule.forChild(AsoNotificationListPage),
  ],
})
export class AsoNotificationListPageModule {}
