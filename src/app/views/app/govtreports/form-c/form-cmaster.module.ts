import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormCMasterRoutingModule } from './form-cmaster-routing.module';
import { FormCComponent } from './form-c.component';


@NgModule({
  declarations: [FormCComponent],
  imports: [
    CommonModule,
    FormCMasterRoutingModule
  ]
})
export class FormCMasterModule { }
