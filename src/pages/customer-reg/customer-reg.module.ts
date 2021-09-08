import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerRegPage } from './customer-reg';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { PipesModule } from '../../pipes/pipes.module';
import { BrMaskerModule } from 'brmasker-ionic-3';
@NgModule({
  declarations: [
    CustomerRegPage,
  ],
  imports: [
    SelectSearchableModule,PipesModule,
    IonicPageModule.forChild(CustomerRegPage),
    BrMaskerModule
  ],
})
export class CustomerRegPageModule {}
