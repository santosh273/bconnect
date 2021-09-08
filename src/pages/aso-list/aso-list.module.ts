import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AsoListPage } from './aso-list';

@NgModule({
  declarations: [
    AsoListPage,
  ],
  imports: [
    IonicPageModule.forChild(AsoListPage),
  ]
})
export class AsoListPageModule {}
