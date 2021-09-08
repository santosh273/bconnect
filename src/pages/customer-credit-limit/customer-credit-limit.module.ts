import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerCreditLimitPage } from './customer-credit-limit';
import { SelectSearchableModule } from 'ionic-select-searchable';
@NgModule({
  declarations: [
    CustomerCreditLimitPage,
  ],
  imports: [
    SelectSearchableModule,
    IonicPageModule.forChild(CustomerCreditLimitPage),
  ],
})
export class CustomerCreditLimitPageModule {}
