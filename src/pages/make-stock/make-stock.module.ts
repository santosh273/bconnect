import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MakeStockPage } from './make-stock';

@NgModule({
  declarations: [
    MakeStockPage,
  ],
  imports: [
    IonicPageModule.forChild(MakeStockPage),
  ],
})
export class MakeStockPageModule {}
