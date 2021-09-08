import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComplainsPage } from './complains';

@NgModule({
  declarations: [
    ComplainsPage,
  ],
  imports: [
    IonicPageModule.forChild(ComplainsPage),
  ],
})
export class ComplainsPageModule {}
