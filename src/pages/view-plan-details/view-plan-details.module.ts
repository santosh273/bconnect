import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewPlanDetailsPage } from './view-plan-details';

@NgModule({
  declarations: [
    ViewPlanDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewPlanDetailsPage),
  ],
})
export class ViewPlanDetailsPageModule {}
