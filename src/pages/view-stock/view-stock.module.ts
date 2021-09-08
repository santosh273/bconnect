import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewStockPage } from './view-stock';

@NgModule({
  declarations: [
    ViewStockPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewStockPage),
  ],
})
export class ViewStockPageModule {}
