import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RejectedPage } from './rejected';

@NgModule({
  declarations: [
    RejectedPage,
  ],
  imports: [
    IonicPageModule.forChild(RejectedPage),
  ],
})
export class RejectedPageModule {}
