import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InActivePage } from './in-active';

@NgModule({
  declarations: [
    InActivePage,
  ],
  imports: [
    IonicPageModule.forChild(InActivePage),
  ],
})
export class InActivePageModule {}
