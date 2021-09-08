import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GiftsStatusPage } from './gifts-status';

@NgModule({
  declarations: [
    GiftsStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(GiftsStatusPage),
  ],
})
export class GiftsStatusPageModule {}
