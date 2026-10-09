import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBMasterRoutingModule } from './form-bmaster-routing.module';
import { FormBComponent } from './form-b.component';


@NgModule({
  declarations: [FormBComponent],
  imports: [
    CommonModule,
    FormBMasterRoutingModule
  ]
})
export class FormBMasterModule { }
