import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyDocPage } from './my-doc';

@NgModule({
  declarations: [
    MyDocPage,
  ],
  imports: [
    IonicPageModule.forChild(MyDocPage),
  ],
})
export class MyDocPageModule {}
