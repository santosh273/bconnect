import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewCompDetailsPage } from './view-comp-details';

@NgModule({
  declarations: [
    ViewCompDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewCompDetailsPage),
  ],
})
export class ViewCompDetailsPageModule {}
