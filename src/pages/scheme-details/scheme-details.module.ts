import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SchemeDetailsPage } from './scheme-details';

@NgModule({
  declarations: [
    SchemeDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(SchemeDetailsPage),
  ],
})
export class SchemeDetailsPageModule {}
