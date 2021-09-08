import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CDetailsPage } from './c-details';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    CDetailsPage,
  ],
  imports: [
    SelectSearchableModule,PipesModule,
    IonicPageModule.forChild(CDetailsPage),
  ],
})
export class CDetailsPageModule {}
