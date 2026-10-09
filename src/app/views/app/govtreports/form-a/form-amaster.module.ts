import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormAMasterRoutingModule } from './form-amaster-routing.module';
import { FormAComponent } from './form-a.component';


@NgModule({
  declarations: [FormAComponent],
  imports: [
    CommonModule,
    FormAMasterRoutingModule
  ]
})
export class FormAMasterModule { }
