import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AsoHomePage } from './aso-home';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    AsoHomePage,
    //  SafePipe
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(AsoHomePage),
  ],
})
export class AsoHomePageModule {}
