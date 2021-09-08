import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewPlanePage } from './view-plane';

@NgModule({
  declarations: [
    ViewPlanePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewPlanePage),
  ],
})
export class ViewPlanePageModule {}
